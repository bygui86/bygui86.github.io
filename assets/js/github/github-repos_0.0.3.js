
jQuery.loadRepos = function(username, callback) {
	jQuery.getJSON('http://api.github.com/users/' + username + '/repos?per_page=10000&callback=?', callback);
};

jQuery.fn.loadGitHubRepositories = function(username) {
	var myProjects = $("#content-github-my-projects");
	var forkedProjects = $("#content-github-forked-projects");
	
	myProjects.html('<div class="loading loading-lg"></div>');
	forkedProjects.html('<div class="loading loading-lg"></div>');
	$.loadRepos(username, function(data) {
		var repos = data.data;
		sortByName(repos);
		
		console.log(window.innerWidth);

		myProjects.empty();
		forkedProjects.empty();
		$(repos).each(function() {
			var time = millisecondsToStr(new Date() - new Date(this.created_at));
			var icon = getIcon(this.language, this.name);
			var description = getDescription(this.description, window.innerWidth);

			if (this.fork) {
				forkedProjects.append('<div class="gha-activity"><div class="gha-activity-icon"><span class="octicon"><img class="projicon" src="' + icon + '"></span></div><div class="gha-message"><div class="gha-time">' + time + '</div><a href="' + this.html_url + '" target="_blank">' + this.full_name + '</a><ul class="gha-commits"><li><small>' + description + '</small></li></ul></div><div class="gha-clear"></div></div>');
			} else {
				myProjects.append('<div class="gha-activity"><div class="gha-activity-icon"><span class="octicon"><img class="projicon" src="' + icon + '"></span></div><div class="gha-message"><div class="gha-time">' + time + '</div><a href="' + this.html_url + '" target="_blank">' + this.full_name + '</a><ul class="gha-commits"><li><small>' + description + '</small></li></ul></div><div class="gha-clear"></div></div>');
			}
		});
	});

	function getDescription(description, windowWidth) {
		
		if (description === undefined || description === null) {
			return '';
		}
		
		var dots = '...';

		if (windowWidth > 1920
			|| (windowWidth <= 1920 && windowWidth > 1600)) {
			var maxLength = 185;
			if(description.length < maxLength){
				return description;
			} else {
				return description.substring(0, maxLength) + dots;
			}
		}
		
		if (windowWidth <= 1600 && windowWidth > 1024) {
			var maxLength = 155;
			if(description.length < maxLength){
				return description;
			} else {
				return description.substring(0, maxLength) + dots;
			}
		}

		if (windowWidth <= 1024 && windowWidth > 720) {
			var maxLength = 80;
			if(description.length < maxLength){
				return description;
			} else {
				return description.substring(0, maxLength) + dots;
			}
		}

		var maxLength = 50;
		if(description.length < maxLength){
			return description;
		} else {
			return description.substring(0, maxLength) + dots;
		}
	}

	function getIcon(language, name) {
		if(language !== undefined && language !== null){
			if(language.toLowerCase() === 'java') {
				if(name !== undefined && name !== null){
					if(name.includes('spring-cloud')) {
						return 'assets/img/spring-cloud-1.png';
					}
					if(name.includes('spring')) {
						return 'assets/img/spring-2.png';
					}
				}
				return 'assets/img/java-3.png';
			}
			if(language.toLowerCase() === 'javascript') {
				return 'assets/img/javascript-2.png';
			}
			if(language.toLowerCase() === 'golang') {
				return 'assets/img/goalng-1.png';
			}
		}
		if(name !== undefined && name !== null){
			if(name.includes('spring-cloud')) {
				return 'assets/img/spring-cloud-1.png';
			}
			if(name.includes('spring')) {
				return 'assets/img/spring-2.png';
			}
			if(name.includes('java')) {
				return 'assets/img/java-3.png';
			}
			if(name.includes('javascript')) {
				return 'assets/img/javascript-2.png';
			}
			if(name.includes('golang')) {
				return 'assets/img/goalng-1.png';
			}
			if(name.includes('kube')) {
				return 'assets/img/kube-2.png';
			}
			if(name.includes('docker')) {
				return 'assets/img/docker-4.png';
			}
		}
		return 'assets/img/github-3.png';
	}

	// Sort repositories by full_name
	function sortByName(repos) {
		repos.sort( function(a, b) {
				if (a.full_name.toLowerCase() < b.full_name.toLowerCase())
					return -1;
				if (a.full_name.toLowerCase() > b.full_name.toLowerCase())
					return 1;
				return 0;
			}
		);
	}

	// Takes in milliseconds and converts it to a human readable time, such as 'about 3 hours ago' or '23 days ago'
	function millisecondsToStr(milliseconds) {
		'use strict';

		function numberEnding(number) {
			return (number > 1) ? 's ago' : ' ago';
		}

		var temp = Math.floor(milliseconds / 1000);

		var years = Math.floor(temp / 31536000);
		if (years) return years + ' year' + numberEnding(years);

		var months = Math.floor((temp %= 31536000) / 2592000);
		if (months) return months + ' month' + numberEnding(months);

		var days = Math.floor((temp %= 2592000) / 86400);
		if (days) return days + ' day' + numberEnding(days);

		var hours = Math.floor((temp %= 86400) / 3600);
		if (hours) return 'about ' + hours + ' hour' + numberEnding(hours);

		var minutes = Math.floor((temp %= 3600) / 60);
		if (minutes) return minutes + ' minute' + numberEnding(minutes);

		var seconds = temp % 60;
		if (seconds) return seconds + ' second' + numberEnding(seconds);
		
		return 'just now';
	}

};
