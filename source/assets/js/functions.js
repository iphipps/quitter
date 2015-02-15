var quitter = {
	init: function(){
		this.buildDates();
		this.buildElapsed();
		this.calculations();
		this.cigsCalcs();
		this.stringBuilder();
		this.domManip();

	},
	pricePerPack: 12.25,//in dollars
	smokedPerDay: 12, //in number of cigs
	q: new Date(2014, 10, 10),
	t: new Date(),
	results: {},
	oneDay: (1000*60*60*24),
	buildDates: function(){
		this.results = {
			tDate: this.t.getDate(),
			qDate: this.q.getDate(),
			tMonth: this.t.getMonth(),
			qMonth : this.q.getMonth(),
			tYear : this.t.getYear(),
			qYear : this.q.getYear(),
			elapsedDays: 0,
			
		};
	},
	buildElapsed: function(){
		this.results.elapsedDays= Math.floor((this.t.getTime()-this.q.getTime())/(this.oneDay));
	},
	testLeap: function(year){
		var monthDays;
		if ( year % 4 === 0 ){
			monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		}else{
			monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		}
		return monthDays;
	},
	calcResults: {},
	calculations: function(){
		var diffYear = this.results.tYear - this.results.qYear;
		var diffMonth = this.results.tMonth - this.results.qMonth;
		var diffDay = this.results.tDate - this.results.qDate;
		var newdiffYear = 0;
		var newdiffMonth = 0;
		var newdiffDay = 0;
		var calculateDay = function(){
			if(diffDay >= 1){
				diffDay = diffDay;
				diffMonth = diffMonth;
			}else if(diffDay === 0){
				diffDay = 0;
				diffMonth = diffMonth;
			}else{
				diffDay = quitter.testLeap(quitter.results.tYear)[quitter.results.tMonth] - quitter.results.qDate + quitter.results.tDate;
				diffMonth = diffMonth - 1;
			}
		};
		var calculateMonth = function(){
			if(diffMonth >= 1){
				diffYear = diffYear;
				calculateDay();
			}else if(diffMonth === 0){
				diffYear = diffYear;
				calculateDay();

			}else{
				diffYear = diffYear - 1;
				diffMonth = diffMonth + 12;
				calculateDay();
			}
		};
		var calculateYear = function(){
			if ( diffYear >= 1){
				calculateMonth();
			}else{
				diffYear = 0;
				calculateMonth();
			}
		};
		var cleanUp = function(){
			calculateYear();
			if(diffMonth < 0){
				diffYear = diffYear - 1;
				diffMonth = diffMonth + 12;
			}
			var weeksPassed = Math.floor(diffDay / 7);
			quitter.calcResults = {
				yearsPassed: diffYear,
				monthsPassed: diffMonth,
				daysPassed: diffDay % 7,
				weeksPassed: weeksPassed
			};
		};
		cleanUp();
	
	},
	cigs: {},
	cigsCalcs: function(){
		this.cigs.smoked = this.results.elapsedDays * this.smokedPerDay;
		this.cigs.packs = Math.floor(this.cigs.smoked / 20);
		this.cigs.loose = this.cigs.smoked % 20;
		this.cigs.moneySaved = (this.cigs.smoked * (this.pricePerPack/20)).toFixed(2);

	},
	strings: {},
	stringBuilder: function(){
		this.strings.timePassed = '';
		var connector = ' ';
		if(this.calcResults.yearsPassed > 0){
			if(this.calcResults.yearsPassed > 1){
				connector = 's ';
			}
			this.strings.timePassed = this.calcResults.yearsPassed + ' Year' + connector;
		}
		if (this.calcResults.monthsPassed > 0){
			if(this.calcResults.monthsPassed > 1){
				connector = 's ';
			}
			this.strings.timePassed = this.strings.timePassed + this.calcResults.monthsPassed + ' Month' + connector;
		}
		if (this.calcResults.weeksPassed > 0){
			if(this.calcResults.weeksPassed > 1){
				connector = 's ';
			}
			this.strings.timePassed = this.strings.timePassed + this.calcResults.weeksPassed + ' Week' + connector;
		}
		if (this.calcResults.daysPassed > 0){
			if(this.calcResults.daysPassed > 1){
				connector = 's ';
			}else{
				connector = '';
			}
			this.strings.timePassed = this.strings.timePassed + this.calcResults.daysPassed + ' Day' + connector;
		}
		//pack cig function
		this.strings.cigsSmoked = '';
		//reset connector
		connector = '';
		if(this.cigs.packs > 0){
			if(this.cigs.packs > 1){
				connector = 's ';
			}
			this.strings.cigsSmoked = this.cigs.packs + ' Pack' + connector;
		}
		if(this.cigs.loose > 0){
			if(this.cigs.loose > 1){
				connector = 'ies';
			}else{
				connector = 'ey';
			}
			this.strings.cigsSmoked = this.strings.cigsSmoked + this.cigs.loose + ' Loos' + connector;
		}
	},
	domManip: function(){
		$('.days-since-quit').html(this.strings.timePassed);
		$('.cigarettes').html(this.strings.cigsSmoked);
		$('.money-saved').html(this.cigs.moneySaved);
	}

};

$(function() {
	quitter.init();
});

