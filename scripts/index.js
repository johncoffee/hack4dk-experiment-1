var baseUrl = "//ragelse.dk/";
var oldPeople = [
    './assets/images/16213259323_7dba16b75c_z.jpg',
    './assets/images/16443294914_32213cceff_z.jpg',
    './assets/images/16656845429_425b8305e4_z.jpg',
    './assets/images/16841568492_3684de3c87_z.jpg',
    './assets/images/16880711829_4c9a22552c_z.jpg',
    './assets/images/17066613675_1b479b849e_z.jpg',
    './assets/images/17608847822_bd9fe1c35f_z.jpg',
    './assets/images/21581261632_d0d880ac5a_z.jpg',
    './assets/images/CRW_2900.jpg',
    './assets/images/KMS3025.jpg',
    './assets/images/img0111.jpg',
    './assets/images/img0145.jpg',
    './assets/images/img0146.jpg',
    './assets/images/img0158.jpg',
    './assets/images/img0259.jpg',
    './assets/images/img0264.jpg',
    './assets/images/kms7479.jpg',
    './assets/images/tumblr_inline_nmqucnBpHF1t8luy9_500.jpg',
    './assets/images/tumblr_inline_nmqudsB1Dd1t8luy9_500.jpg',
    './assets/images/tumblr_inline_nmquj7vGhT1t8luy9_540.jpg'
];

$(function () {
    // 
    
    AuthService.onInstaLoginCallback = function (instagramObj) {
        fetchTags(instagramObj);
    };
    
    AuthService.openInstagramPopup();
});


function fetchTags(instagramObj, url) {
    ///tags/{{tag-name}}/media/recent
    
    //var req = instagramObj.get("https://api.instagram.com/v1/tags/hipster/media/recent");
    var req = instagramObj.get(url || "https://api.instagram.com/v1/users/self/feed");
    
    req.done(function () {
        var json = req.responseJSON;

        // pagination
        document.querySelector("#load-more").onclick = function() {
            var pagination = json.pagination;
            if (pagination) {
                console.info("next page: " + pagination.next_url);
                fetchTags(instagramObj, pagination.next_url);
            }
        };
        
        // data
        console.debug(json);
        var posts = [];
        json.data.forEach(function (item) {
            var comments = item.comments.data.map(function (comment) {
                return {
                    name: comment.from.full_name,
                    text: comment.text,
                };
            });
            if (item.comments.data.length) {
                posts.push({
                    //url: item.images.standard_resolution.url,
                    url: baseUrl + oldPeople[Math.floor(oldPeople.length * Math.random())],
                    comments: comments,
                });    
            }
        });
        console.debug(posts);
        renderPosts(posts);
    });
}

/**
 * Takes an array of "posts" which has fields: url, comments[] 
 * @param {Array} posts
 */
function renderPosts(posts) {
    var postTpl = document.querySelector("#postTpl").innerHTML;
    var commentTpl = document.querySelector("#templateTpl").innerHTML;
    var postsHTML = "";
    
    posts.forEach(function (post) {
        var commentsHTML = '';
        post.comments.forEach(function(comment){
            commentsHTML += commentTpl
                .replace("{{name}}", comment.name)
                .replace("{{text}}", comment.text)
        });
        
        postsHTML += postTpl
            .replace("{{src}}", post.url)
            .replace("{{comments}}", commentsHTML);
    });
    
    document.querySelector("#posts").innerHTML += postsHTML;
}
