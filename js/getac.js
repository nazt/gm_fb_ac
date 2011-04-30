var DEBUG = true;
function render_display() {
  jQuery.post('/drupal6/facebook/util/info/fbuid/'+ FB.getSession().uid, { fb_session: JSON.stringify(FB.getSession())}, function(res) {
      var json_data = JSON.parse(res);
      $('#get-ac').html('<h1>' + json_data['code']+'</h1>');

      $('#like-box-fan-page').addClass('hidden');
      $('.like-page-first').hide('fast');
      try {
        $('#prepare-page').remove();
        $('#like-box-fan-page').remove();
      }
      catch (e) {
        if(typeof(console) !== 'undefined' && console != null) {
          console.log('error: ', e);
        }
      }
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId  : Drupal.settings.fb_util.appid,
    status : true, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    xfbml  : true  // parse XFBML
  });
  FB.Canvas.setAutoResize(90);
  FB.Event.subscribe('edge.create', function(response) {
    render_display();
  });
  FB.Event.subscribe('xfbml.render', function(response) {
    $('#prepare-page').remove();
    $('#like-box-fan-page').show();
    $('#like-box-fan-page').removeClass('hidden');
  });

  FB.getLoginStatus(function(response) {
    if (response.session) {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log('logged in');
      }
      var uid =  FB.getSession().uid;
      var pageId = Drupal.settings.fb_util.pageid;
      var graph_url = '/' + pageId + '/members/' + uid;
      FB.api(graph_url , function(res) {
        if (res.data.length == 0 && uid != Drupal.settings.fb_util.pageid) {
          $('#prepare-page').remove();
          $('#like-box-fan-page').html('<fb:like-box href="http://www.facebook.com/gamemundotcom" width="292" show_faces="false" stream="false" header="false"></fb:like-box>');
          $('#like-box-fan-page').append("<div class='like-page-first'>กรุณากด Like เพื่อร่วมกิจกรรม</div>");
          FB.XFBML.parse();
          if(typeof(console) !== 'undefined' && console != null) {
            console.log('Not fan');
          }
        }
        else {
          if(typeof(console) !== 'undefined' && console != null) {
           console.log('isFan');
           render_display();
          }
        }
      });
    }
    else {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log('redirect');
      }

      var login_url = "http://www.facebook.com/dialog/oauth/?scope=email&client_id=" + Drupal.settings.fb_util.appid +"&redirect_uri=http://together.in.th/drupal6/facebook/page/verify/&response_type=code_and_token&display=page";
      top.window.location.href = login_url
    }

  });
}

$(function() {

});
