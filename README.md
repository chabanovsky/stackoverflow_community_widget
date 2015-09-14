# stackoverflow_community_widget
Simple example of usages of Stack Exchange API form local communities

If you have a community probably it is a problem to maintain the interest of participants. As a solution you can create a widget for your site and stream there the community users' activities from Stack Overflow.


Simple usages
    
    $(function() {
        init(['id', 'of','users'], "super_secret_api_key");
    
        var activity_root = $("#activity_root");
        CreateActivitiesFeed(activity_root);
    
        var achievement_root = $("#achievement_root");
        CreateUserAchievementsFeed(achievement_root);
    
        questions_root = $("#questions_root");
        CreateQuestionsFeed(questions_root);
    });

[Live example](http://chabanovsky.com/2015/09/stackexchange-api-for-communities/).
