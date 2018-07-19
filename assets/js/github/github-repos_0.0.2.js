
jQuery.loadRepos = function(username, callback) {
	jQuery.getJSON('http://api.github.com/users/' + username + '/repos?per_page=10000&callback=?', callback);
};

jQuery.fn.loadGitHubRepositories = function(username) {
	var myProjects = $("#content-github-my-projects");
	var forkedProjects = $("#content-github-forked-projects");
	
	myProjects.html('<div class="loading loading-lg"></div>');
	forkedProjects.html('<div class="loading loading-lg"></div>');
	$.loadRepos(username, function(data) {
		// meta info: data.meta
		// array of repos: data.data
		var repos = data.data;
		sortByName(repos);

		myProjects.empty();
		forkedProjects.empty();
		$(repos).each(function() {
			// TODO switch to identify if spring, spring-cloud, docker, javascript, java
			if (this.fork) {
				forkedProjects.append('<div class="gha-activity"><div class="gha-activity-icon"><span class="octicon"><img id="spring-icon" class="projicon" src="assets/img/github-3.png"></span></div><div class="gha-message"><div class="gha-time">' + this.created_at + '</div><a href="' + this.html_url + '" target="_blank">' + this.full_name + '</a><ul class="gha-commits"><li><small>' + this.description + '</small></li></ul></div><div class="gha-clear"></div></div>');
			} else {
				myProjects.append('<div class="gha-activity"><div class="gha-activity-icon"><span class="octicon"><img id="spring-icon" class="projicon" src="assets/img/github-3.png"></span></div><div class="gha-message"><div class="gha-time">' + this.created_at + '</div><a href="' + this.html_url + '" target="_blank">' + this.full_name + '</a><ul class="gha-commits"><li><small>' + this.description + '</small></li></ul></div><div class="gha-clear"></div></div>');
			}
		});

		animateAccordions();
	});

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

	function animateAccordions() {
		var acc = document.getElementsByClassName("accordion");
		var i;
		for (i = 0; i < acc.length; i++) {
			acc[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				if (panel.style.maxHeight){
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
				} 
			});
		}
	}
};
