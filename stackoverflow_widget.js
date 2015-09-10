
var user_ids = [];
var site_url = "ru.stackoverflow";
var se_api_url = "api.stackexchange.com/2.2/";
var request_protocol = "http://"
var api_key = ""

var page_size = 7;
var best_posts_page_size = 3;
var best_tags_page_size = 4;
var sort_creation = "creation";
var sort_activity = "activity";
var sort_score = "votes";
var sort_popular = "popular";

var filter_tag = "python";

var post_type_answer = "answer";
var post_type_question = "question";
var post_type_comment = "comment";

var answer_strings = ["ответ", "ответа", "ответов"];
var score_strings = ["голос", "голоса", "голосов"];
var view_strings = ["показ", "показа", "показов"];

var posts_symbols;
var posts_commands;


function init(ids, key) {
	user_ids = ids;
	api_key = key;

    posts_symbols = new Array(post_type_answer, post_type_question, post_type_comment);
	posts_symbols[post_type_answer] = ["О", "отвечен"];
    posts_symbols[post_type_question] = ["В", "задан"];
    posts_symbols[post_type_comment] = ["К", "прокомментирован"];

    posts_commands = new Array(post_type_answer, post_type_question, post_type_comment);
    posts_commands[post_type_answer] = processAnswerTypeItem;
    posts_commands[post_type_question] = processQuestionTypeItem;
    posts_commands[post_type_comment] = processCommentTypeItem;
}

function CreateQuestionsFeed(root_element) {
    var preparedIds = prepareIdsString(user_ids);
    getUsersQuestions(preparedIds, sort_creation,
        function(response){
            if (response == null)
                return;

            for (var j = 0; j < response.items.length; j++) {
                item = response.items[j];
                question = createQuestionFromResponse(item);
                $(root_element).append(question);
            }

        }, errorHandler);
}

function CreateActivitiesFeed(root_element) {
    var preparedIds = prepareIdsString(user_ids);
    getActivities(preparedIds, sort_activity,
        function(response){
            if (response == null)
                return;

            for (var j = 0; j < response.items.length; j++) {
                item = response.items[j];
                func = posts_commands[item.post_type]
                if (func == null)
                    continue;

                func(item, function(content){
                    $(root_element).append(content);
                });
            }

        }, errorHandler);
}

function CreateUserAchievementsFeed(root_element) {
   var preparedIds = prepareIdsString(user_ids);
   getUsers(preparedIds, sort_activity,
       function(response){
           if (response == null)
               return;

            for (var j = 0; j < response.items.length; j++) {
                item = response.items[j];
                achievement = createAchievementFromResponse(item);
                $(root_element).append(achievement);
            }

       }, errorHandler);
}

function CreateTaggedQuestionsFeed(root_element) {
    var preparedIds = prepareIdsString(user_ids);
    getUsersTaggedQuestions(preparedIds, sort_creation, filter_tag,
        function(response){
            if (response == null)
                return;

            for (var j = 0; j < response.items.length; j++) {
                item = response.items[j];
                question = createQuestionFromResponse(item);
                $(root_element).append(question);
            }

        }, errorHandler);
}

function getUsersQuestions(ids, sort, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "users/" + ids + "/questions?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getUsersTaggedQuestions(ids, sort, tags, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "users/" + ids + "/tags/" + tags + "/questions?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getUsersAnswers(ids, sort, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "users/" + ids + "/answers?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getUsersTags(ids, sort, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "users/" + ids + "/tags?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getUsersTopTags(ids, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "users/" + ids + "/top-tags?&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getActivities(ids, sort, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "users/" + ids + "/posts?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getQuestions(ids, sort, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "questions/" + ids + "?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getPosts(ids, sort, context, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "posts/" + ids + "?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: function(response) { successLoadHandler(context, response); },
    	error: errorLoadHandler
    });
}

function getAnswers(ids, sort, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "answers/" + ids + "?order=desc&sort=" + sort + "&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

function getUsers(ids, sort, successLoadHandler, errorLoadHandler, count) {
    if (count == undefined || count == null) {
        count = page_size
    }
	final_url = request_protocol + se_api_url + "users/" + ids + "?order=desc&site=" + site_url + "&pagesize=" + count + "&key=" + api_key;
    $.ajax({
        type: 'GET',
        url: final_url,
        success: successLoadHandler,
    	error: errorLoadHandler
    });
}

// Utility functions

function prepareIdsString(ids) {
    var result = "";
    for (var index = 0; index < ids.length; index++) {
        result += ids[index];
        if (index < ids.length - 1)
        result += ";";
    }
    return result;
}

function errorHandler () {
    console.log("Request Error");
}

function plural(n, forms) {
	return forms[n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2];
}

function getDate(date) {
   var yyyy = date.getFullYear().toString();
   var mm = (date.getMonth()+1).toString();
   var dd = date.getDate().toString();

   return (dd[1]?dd:"0"+dd[0]) + "." + (mm[1]?mm:"0"+mm[0]) + "." + yyyy;
}

function createTagsDiv(question_tags) {
    var tags = document.createElement("div");
    $(tags).addClass("tags");

    for (var i = 0; i < question_tags.length; i++) {
        var tag = document.createElement("span");
        $(tag).addClass("post-tag");
        $(tag).text(question_tags[i]);

        $(tags).append(tag);
    }
    return tags;
}

// Decoration functions

// Questions feed

function createQuestionFromResponse(item) {
    var main_div = document.createElement("div");
    $(main_div).addClass("question");

    left_side = createQuestionStatus(item);
    $(main_div).append(left_side);

    right_side = createQuestionDescription(item);
    $(main_div).append(right_side);

    return main_div;
}

function createQuestionStatus(item) {
    var stats_container = document.createElement("div");
    $(stats_container).addClass("stats_container");
    $(stats_container).attr("onclick", "window.location.href='" + item.link + "'");

    var votes = document.createElement("div");
    $(votes).addClass("votes");

    var votes_count = document.createElement("div");
    $(votes_count).addClass("count");
    $(votes_count).append(item.score);
    var votes_count_word = document.createElement("div");
    $(votes_count_word).append(plural(parseInt(item.score), score_strings));

    $(votes).append(votes_count);
    $(votes).append(votes_count_word);

    var status = document.createElement("div");
    $(status).addClass("status");
    if (item.is_answered)
        $(status).addClass(" answered");

    var answer_count = document.createElement("div");
    $(answer_count).append(item.answer_count);
    $(answer_count).addClass("count");
    var answer_count_word = document.createElement("div");
    $(answer_count_word).append(plural(parseInt(item.answer_count), answer_strings));

    $(status).append(answer_count);
    $(status).append(answer_count_word);

    var views = document.createElement("div");
    $(views).addClass("views");

    var views_count = document.createElement("div");
    $(views_count).append(item.view_count);
    $(views_count).addClass("count");
    var views_count_word = document.createElement("div");
    $(views_count_word).append(plural(parseInt(item.view_count), view_strings));

    $(views).append(views_count);
    $(views).append(views_count_word);

    $(stats_container).append(votes);
    $(stats_container).append(status);
    $(stats_container).append(views);

    return stats_container;
}

function createQuestionDescription(item) {
    var desc = document.createElement("div");
    $(desc).addClass("desc");

    var h3_title = document.createElement("h3");
    var a_title = document.createElement("a");
    $(a_title).attr("href", item.link);
    $(a_title).text(item.title);

    $(h3_title).append(a_title);

    var tags = createTagsDiv(item.tags);

    var owner = document.createElement("div");
    $(owner).addClass("owner");

    var last_active = document.createElement("span");
    var active = new Date(parseInt(1000 * item.creation_date));
    $(last_active).text("задан " + getDate(active) + " ");
    var author = document.createElement("a");
    $(author).attr("href", item.owner.link);
    $(author).text(item.display_name);

    $(owner).append(last_active);
    $(owner).append(author);

    $(desc).append(h3_title);
    $(desc).append(tags);
    $(desc).append(owner);

    return desc;
}

// Activities Feed

function getQuestionItemHelper(id, params, contentCallback, createContentCallback) {
    getQuestions(id, sort_creation,
       function(response){
           if (response == null)
               return;

           if (response.items.length != 1) {
               console.log("Wrong number of items per one id");
               return;
           }

           contentCallback(createContentCallback(params, response.items[0]));

    }, errorHandler);
}

function processQuestionTypeItem(item, contentCallback) {
    getQuestionItemHelper(item.post_id, item, contentCallback, createActivityItem);
}

function processAnswerTypeItem(item, contentCallback) {
    getAnswers(item.post_id, sort_creation,
       function(response){
           if (response == null)
               return;

           if (response.items.length != 1) {
               console.log("Wrong number of items per one id");
               return;
           }
           getQuestionItemHelper(response.items[0].question_id, item, contentCallback, createActivityItem);

    }, errorHandler);
}

function processCommentTypeItem(item, contentCallback) {
}

function createActivityItem(item, question) {
    var activity_item_container = document.createElement("div");
    $(activity_item_container).addClass("activity");

    var owner = createActivityOwner(item);
    var activity = createActivity(item, question);

    $(activity_item_container).append(owner);
    $(activity_item_container).append(activity);

    return activity_item_container;
}

function createActivityOwner(item) {
    var owner_container = document.createElement("div");
    $(owner_container).addClass("owner");
    $(owner_container).attr("onclick", "window.location.href='" + item.owner.link + "'");

    var img_div = document.createElement("div");
    $(img_div).addClass("img");
    var img = document.createElement("img");
    $(img).attr("src", item.owner.profile_image);
    var img_span = document.createElement("span");
    $(img_span).append(img)
    $(img_div).append(img_span);

    var name = document.createElement("div");
    $(name).addClass("name");
    $(name).text(item.owner.display_name);

    var reputation = document.createElement("div");
    $(reputation).addClass("reputation");
    $(reputation).text(item.owner.reputation);

    $(owner_container).append(img_div);
    $(owner_container).append(name);
    $(owner_container).append(reputation);

    return owner_container;
}

function createActivity(item, question) {
    var question_container = document.createElement("div");
    $(question_container).addClass("question");

    var title_h3 = document.createElement("h3");
    $(title_h3).addClass("title");
    var author = document.createElement("a");
    $(author).attr("href", item.link);

    var title = posts_symbols[item.post_type][0] + ": " + question.title;
    $(author).text(title);
    $(title_h3).append(author);

    var tags = createTagsDiv(question.tags);

    var info = document.createElement("div");
    $(info).addClass("info");
    var date = new Date(parseInt(1000 * item.creation_date));
    var date_string = posts_symbols[item.post_type][1] + " " + getDate(date);
    var info_string = item.score + " " + plural(parseInt(item.score), score_strings) + ", " + question.view_count + " " + plural(parseInt(question.view_count), view_strings);

    $(info).text(date_string + ", " + info_string);

    $(question_container).append(title_h3);
    $(question_container).append(info);
    $(question_container).append(tags);


    return question_container;
}

function createAchievementFromResponse(item) {
    var achievement_container = document.createElement("div");
    $(achievement_container).addClass("achievement");

    var user_description = createUserDescription(item);
    var user_activities = createUserActivities(item);

    $(achievement_container).append(user_description);
    $(achievement_container).append(user_activities);

    return achievement_container;
}

function createBadgeHelper(count, badge_name){

    var badge = document.createElement("span");
    $(badge).addClass(badge_name);
    var badge_img = document.createElement("span");
    $(badge_img).addClass("badge");
    var badge_count = document.createElement("span");
    $(badge_count).addClass("count");
    $(badge_count).text(count);

    $(badge).append(badge_img);
    $(badge).append(badge_count);

    return badge;
}


function createUserDescription(item) {
    var owner = document.createElement("div");
    $(owner).addClass("owner");

    var img_div = document.createElement("div");
    $(img_div).addClass("img");
    var img = document.createElement("img");
    $(img).attr("src", item.profile_image);
    $(img_div).append(img);

    var name = document.createElement("div");
    $(name).addClass("name");
    $(name).text(item.display_name);

    var reputation = document.createElement("div");
    $(reputation).addClass("reputation");
    $(reputation).text(item.reputation);

    var badges = document.createElement("div");
    $(badges).addClass("badges");

    var gold = createBadgeHelper(item.badge_counts.gold, "gold");
    var silver = createBadgeHelper(item.badge_counts.silver, "silver");
    var bronze = createBadgeHelper(item.badge_counts.bronze, "bronze");

    $(badges).append(gold);
    $(badges).append(silver);
    $(badges).append(bronze);

    $(owner).append(img_div);
    $(owner).append(name);
    $(owner).append(reputation);
    $(owner).append(badges);

    return owner;
}

function createUserActivityItem(title, link, vote_count) {
    var activity = document.createElement("div");
    $(activity).addClass("activity");
    var score= document.createElement("span");
    $(score).addClass("score");
    $(score).text(vote_count);
    var anchor = document.createElement("a");
    $(anchor).attr("href", link);
    $(anchor).text(title);

    $(activity).append(score);
    $(activity).append(anchor);

    return activity;
}

function createUserQuestionActivities(item) {
    var questions = document.createElement("div");
    $(questions).addClass("questions");
    var questions_headline = document.createElement("div");
    $(questions_headline).addClass("headline");
    $(questions_headline).text("Вопросы");
    $(questions).append(questions_headline);

    getUsersQuestions(item.user_id, sort_score,
        function(response){
            if (response == null)
                return;

            for (var index = 0; index < response.items.length; index++) {
                item = response.items[index];
                $(questions).append(createUserActivityItem(item.title, item.link, item.score));
            }

        }, errorHandler, best_posts_page_size);


    return questions;
}

function createUserAnswerActivities(item) {
    var answers = document.createElement("div");
    $(answers).addClass("answers");
    var answers_headline = document.createElement("div");
    $(answers_headline).addClass("headline");
    $(answers_headline).text("Ответы");
    $(answers).append(answers_headline);

    getUsersAnswers(item.user_id, sort_score,
        function(response){
            if (response == null)
                return;

            for (var index = 0; index < response.items.length; index++) {
                var item = response.items[index];

                getPosts(item.answer_id, sort_score, item, function (context, sub_response) {
                    if (sub_response == null || sub_response.items.length != 1)
                        return;

                    getQuestionItemHelper(context.question_id, sub_response.items[0], function(content){
                        $(answers).append(content);
                    },
                    function (initial_item, response_item) {
                        return createUserActivityItem(response_item.title, initial_item.link, initial_item.score);
                    });

                }, errorHandler);
            }

        }, errorHandler, best_posts_page_size);


    return answers;
}

function createUserTopTagItem(item) {
    var tag_container = document.createElement("div");
    $(tag_container).addClass("tag_container");
    var tag = document.createElement("span");
    $(tag).addClass("post-tag");
    $(tag).text(item.tag_name);

    var stats = document.createElement("div");
    $(stats).addClass("stats");

    var score = document.createElement("div");
    $(score).addClass("num");
    var score_title = document.createElement("span");
    $(score_title).text("Рейтинг");
    $(score).append(score_title);
    $(score).append((item.answer_score + item.question_score));

    var posts = document.createElement("div");
    $(posts).addClass("num");
    var posts_title = document.createElement("span");
    $(posts_title).text("Сообщения");
    $(posts).append(posts_title);
    $(posts).append((item.answer_count + item.question_count));

    $(stats).append(score);
    $(stats).append(posts);

    $(tag_container).append(tag);
    $(tag_container).append(stats);

    return tag_container;
}

function createUserTagActivities(item) {
    var tags = document.createElement("div");
    $(tags).addClass("tags");
    var tags_headline = document.createElement("div");
    $(tags_headline).addClass("headline");
    $(tags_headline).text("Метки");
    var content_line = document.createElement("div");
    $(content_line).addClass("line");
    $(tags).append(tags_headline);
    $(tags).append(content_line);


    getUsersTopTags(item.user_id,
        function(response){
            if (response == null)
                return;

            for (var index = 0; index < response.items.length; index++) {
                item = response.items[index];
                $(content_line).append(createUserTopTagItem(item));
            }

        }, errorHandler, best_tags_page_size);


    return tags;
}

function createUserActivities(item) {
    var activities = document.createElement("div");
    $(activities).addClass("activities");
    var questions = createUserQuestionActivities(item);
    var answers = createUserAnswerActivities(item);
    var tags = createUserTagActivities(item);

    $(activities).append(questions);
    $(activities).append(answers);
    $(activities).append(tags);

    return activities;
}