
jQuery.loadRepos = function(username, callback) {
	// https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#list-repositories-for-a-user
	jQuery.getJSON('https://api.github.com/users/' + username + '/repos?sort=updated&callback=?', callback);
};

jQuery.fn.loadGitHubRepositories = function(username) {
	var myProjects = $("#content-github-my-projects");
	
	myProjects.html('<div class="loading loading-lg"></div>');
	$.loadRepos(username, function(data) {
		var repos = data.data;
		sortByUpdatedTime(repos);
		
		console.log(window.innerWidth);

		myProjects.empty();
		$(repos).each(function() {
			if (!this.fork) {
				var time = millisecondsToStr(new Date() - new Date(this.updated_at));
				var icon = getIcon(this.language, this.full_name);
				var description = getDescription(this.description, window.innerWidth);

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
		// check language
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
			if(language.toLowerCase() === 'go' || language.toLowerCase() === 'golang') {
				return 'assets/img/golang-1.png';
			}
		}
		// check name
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
			if(name.includes('go-') || name.includes('golang')) {
				return 'assets/img/golang-1.png';
			}
			if(name.includes('kube')) {
				return 'assets/img/kube-2.png';
			}
			if(name.includes('docker')) {
				return 'assets/img/docker-4.png';
			}
			if(name.includes('bygui86')) {
				return 'assets/img/mb-solid_logo-1.png';
			}
		}
		return 'assets/img/github-3.png';
	}

	function sortByUpdatedTime(repos) {
		repos.sort( function(a, b) {
				if (a.updated_at < b.updated_at)
					return 1;
				if (a.updated_at > b.updated_at)
					return -1;
				return 0;
			}
		);
	}

	function sortByFullName(repos) {
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
