
jQuery.loadRepos = function(username, callback) {
	jQuery.getJSON('http://api.github.com/users/' + username + '/repos?per_page=10000&callback=?', callback);
	// including repos from organisations
	// jQuery.getJSON('http://api.github.com/users/' + username + '/repos?per_page=1000&type=all&callback=?', callback);
};

jQuery.fn.loadGitHubRepositories = function(username) {
	var myProjects = $("#my-projects");
	var forkedProjects = $("#forked-projects");
	
	myProjects.html('<span>Querying GitHub for my repositories...</span>');
	forkedProjects.html('<span>Querying GitHub for forked repositories...</span>');
	$.loadRepos(username, function(data) {
		// meta info: data.meta
		// array of repos: data.data

		var repos = data.data;
		// console.log(data.data);
		// console.log("Total repos found: " + repos.length);
		sortByName(repos);

		// usefull info: created_at, description, fork, full_name, html_url, language, name
		// other info: forks, watchers
		myProjects.empty();
		forkedProjects.empty();
		$(repos).each(function() {
			if (this.fork) {
				forkedProjects.append('<button class="accordion"><span class="octicon octicon-mark-github"></span> <a href="'+ this.html_url +'">' + this.full_name + '</a></button>');
				forkedProjects.append('<div class="panel"><p>' + this.created_at + ' - ' + this.language + '</p><p>' + this.description + '</p></div>');
			} else {
				myProjects.append('<button class="accordion"><span class="octicon octicon-mark-github"></span> <a href="'+ this.html_url +'">' + this.full_name + '</a></button>');
				myProjects.append('<div class="panel"><p>' + this.created_at + ' - ' + this.language + '</p><p>' + this.description + '</p></div>');
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
