(window.getCookie = function (e) {
  for (var t = e + "=", n = document.cookie.split(";"), s = 0; s < n.length; s++) {
    for (var a = n[s]; " " == a.charAt(0); ) a = a.substring(1);
    if (0 == a.indexOf(t)) return a.substring(t.length, a.length);
  }
  return "";
}),
  (window.setCookie = function (e, t, n) {
    var s = new Date();
    s.setTime(s.getTime() + 24 * n * 60 * 60 * 1e3);
    s = "expires=" + s.toUTCString() + "; domain=" + window.location.hostname + "; path=/ ";
    document.cookie = e + "=" + t + "; " + s;
  }),
  (Number.isInteger =
    Number.isInteger ||
    function (e) {
      return "number" == typeof e && isFinite(e) && Math.floor(e) === e;
    });
var get_special_planets = function (e, t, n) {
  var s, a, i, o;
  "birthchart" == window.charttype
    ? ((a = (s = window.horoscope_info[0]).date.replace(":", "-")),
      (i = n.custom_latlng ? $("#custom_lat").val() : s.latitude),
      (o = n.custom_latlng ? $("#custom_lng").val() : s.longitude),
      $.ajax({
        type: "GET",
        url: "/tools/get_special_planets_ajax",
        data: {
          charttype: "birthchart",
          house_key: e || "p",
          name: "",
          place: "",
          date: a,
          lat: i,
          lng: o,
          hasBirthTime: s.hasBirthTime,
          custom_dst: n.custom_dst,
          is_sidereal: n.showSidereal,
        },
        success: function (e) {
          e = $.parseJSON(e);
          (window.houses = e.houses),
            (window.planets = e.planets),
            s.hasBirthTime ||
              ((e = _.reject(e.planets, function (e) {
                if (_.contains(["Ascendant", "MC"], e[0])) return !0;
              })),
              (window.planets = e)),
            t();
        },
      }))
    : "composite" == window.charttype
    ? $.ajax({
        type: "GET",
        url: "/tools/get_special_planets_ajax",
        data: {
          charttype: "composite",
          house_key: e,
          h1: JSON.stringify(window.horoscope_info1),
          h2: JSON.stringify(window.horoscope_info2),
          is_sidereal: n.showSidereal,
        },
        success: function (e) {
          e = $.parseJSON(e);
          (window.houses = e.houses),
            (window.planets = e.planets),
            (window.planets_p1 = e.planets_p1),
            (window.planets_p2 = e.planets_p2),
            t();
        },
      })
    : "synastry" == window.charttype &&
      $.ajax({
        type: "GET",
        url: "/tools/get_special_planets_ajax",
        data: {
          charttype: "synastry",
          house_key: e,
          h1: JSON.stringify(window.horoscope_info1),
          h2: JSON.stringify(window.horoscope_info2),
          is_sidereal: n.showSidereal,
        },
        success: function (e) {
          e = $.parseJSON(e);
          (window.planets_p1 = e.planets_p1), (window.planets_p2 = e.planets_p2), t();
        },
      });
};
function capitalize(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
var Horoscope_Package = Backbone.View.extend({
    initialize: function () {
      ((this.settings = this.getUserSettings()).isSetUp = !1),
        "viewtype" in window || window.viewtype,
        this.reset_chart();
    },
    setupViews: function (e) {
      (this.eventBus = _.extend({}, Backbone.Events)),
        this.eventBus.on("redrawChart", this.drawChart, this),
        this.eventBus.on("refreshViews", this.refreshViews, this),
        this.eventBus.on("reset_chart", this.reset_chart, this),
        (this.planet_view = new Planet_View({
          planets: this.horoscope.planets,
          settings: e,
          eventBus: this.eventBus,
        }));
      var t = this.horoscope.get_important_aspects(),
        n = this.horoscope.get_extended_aspects();
      (this.aspect_view = new Aspect_View(t, n)),
        (("birthchart" == window.charttype && this.horoscope.birthTime) ||
          "composite" == window.charttype) &&
          (this.house_view = new House_View({
            houses: this.horoscope.houses,
            planets: this.horoscope.planets,
            eventBus: this.eventBus,
            settings: e,
          })),
        (this.menu_view = new Menu_View({
          houses: this.horoscope.houses,
          settings: e,
          eventBus: this.eventBus,
        })),
        "synastry" != window.charttype &&
          ((this.horoscope.patterns = this.horoscope.get_aspect_patterns()),
          (this.pattern_view = new Pattern_View(this.horoscope))),
        "synastry" == window.charttype &&
          (this.description_view = new Descriptions_View(this.horoscope)),
        ("birthchart" != window.charttype && "composite" != window.charttype) ||
          (this.specialnotes_view = new SpecialNotes_View(this.horoscope)),
        ("birthchart" != window.charttype && "synastry" != window.charttype) ||
          (this.declination_view = new Declination_View({
            horoscope: this.horoscope,
            settings: e,
            eventBus: this.eventBus,
          }));
    },
    reset_chart: function () {
      function e() {
        var e;
        n.drawChart(),
          t.isSetUp
            ? n.refreshViews()
            : ((e = t),
              "user" == window.viewtype ? n.setupUserViews(e) : n.setupViews(e),
              (t.isSetUp = !0));
      }
      var t = this.settings,
        n = this;
      "birthchart" == window.charttype
        ? (window.planets = t.backup_planets)
        : ((window.planets = t.backup_planets),
          (window.planets_p1 = t.backup_planets_p1),
          (window.planets_p2 = t.backup_planets_p2)),
        (window.houses = t.backup_houses);
      var s = "house_key" in t && "p" != t.house_key;
      t.showSidereal || t.custom_dst || s || t.custom_latlng
        ? get_special_planets(t.house_key, e, t)
        : e();
    },
    setupUserViews: function (e) {
      this.eventBus = _.extend({}, Backbone.Events);
    },
    getUserSettings: function () {
      var e,
        t = "birthchart" != window.charttype || window.horoscope_info[0].hasBirthTime;
      return (
        window.chart_settings
          ? (((e = window.chart_settings).planets =
              "" != e.planets_list && $.parseJSON(e.planets_list)),
            (e.aspects = "" != e.aspects_list && $.parseJSON(e.aspects_list)),
            (e.showDeclination = e.showDeclination),
            (e.showHouses = e.showHouses && t),
            (e.custom_dst = !1),
            (e.custom_latlng = !1))
          : (e = {
              showHouses: t,
              showDeclination: !1,
              showSidereal: !1,
              planets: !1,
              aspects: !1,
              house_key: "p",
              custom_dst: !1,
              custom_latlng: !1,
            }),
        (e.backup_houses = window.houses),
        (e.backup_planets = window.planets),
        "birthchart" != window.charttype &&
          ((e.backup_planets_p1 = window.planets_p1), (e.backup_planets_p2 = window.planets_p2)),
        e
      );
    },
    drawChart: function () {
      var e,
        t,
        n = this.settings;
      "synastry" == window.charttype
        ? ((e = n.skin || "fancy"),
          (t = {
            planets_p1: window.planets_p1,
            planets_p2: window.planets_p2,
            paper: "raphael",
            w: 500,
            h: 500,
            skin_name: e + "_synastry",
            ifHouses: !1,
            planets_subset: n.planets,
            aspects_subset: n.aspects,
            custom_orbs: n.custom_orbs,
          }),
          (this.horoscope = new Synastry(t)))
        : ((e = n.skin || "fancy"),
          (e = n.showHouses ? e + "_houses" : e),
          (t = {
            planets: window.planets,
            houses: window.houses,
            paper: "raphael",
            w: 400,
            h: 400,
            skin_name: e,
            ifHouses: n.showHouses,
            planets_subset: n.planets,
            aspects_subset: n.aspects,
            custom_orbs: n.custom_orbs,
          }),
          (this.horoscope = new Horoscope(t))),
        this.horoscope.create(t),
        this.resizeChart();
    },
    resizeChart: function () {
      function e() {
        var e,
          t = $("#chart_display")[0],
          n = $(t).width();
        n < 400 || "synastry" == window.charttype
          ? ((e = n), $("#chart_display").css("min-height", e))
          : ((e = $(t).height()),
            $("#chart_display").css("min-height", "auto"),
            (n = 400 <= e ? e : (e = 400))),
          s.horoscope.paper.changeSize(n, e, !1, !1);
      }
      var s = this;
      e(),
        $(window).resize(function () {
          e();
        });
    },
    refreshViews: function () {
      this.planet_view.populate_planets(this.horoscope.planets, 0),
        ("composite" != window.charttype && "synastry" != window.charttype) ||
          ((planets_subset = this.menu_view.settings.planets),
          this.planet_view.display_individual_planets(planets_subset));
      var e = this.horoscope.get_important_aspects(),
        t = this.horoscope.get_extended_aspects();
      this.aspect_view.populate_aspects(e),
        this.aspect_view.activate_detailed(t),
        "synastry" != window.charttype &&
          (this.settings.showHouses
            ? (this.house_view.populate_houses(window.houses), this.eventBus.trigger("show_houses"))
            : this.eventBus.trigger("hide_houses"),
          (this.horoscope.patterns = this.horoscope.get_aspect_patterns()),
          this.pattern_view.refreshPatterns(this.horoscope)),
        "birthchart" == window.charttype && this.specialnotes_view.populate(this.horoscope);
    },
  }),
  Menu_View = Backbone.View.extend({
    initialize: function (e) {
      function t(e) {
        return e.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, "");
      }
      (this.settings = e.settings),
        (this.eventBus = e.eventBus),
        this.enable_settings(),
        this.setup_save_chart(),
        this.setup_share_chart(),
        $(".prefill-chart a").each(function (e) {
          var t = $(this).attr("href");
          window.location.search.replace("?", "&")
            ? (t += window.location.search.replace("?", "&"))
            : "/chart-of-moment/" != window.location.pathname &&
              (t +=
                "&" +
                (function (e) {
                  var t,
                    n = [];
                  for (t in e) n.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
                  return n.join("&");
                })(
                  "birthchart" == window.charttype
                    ? {
                        name: window.horoscope_info[0].name,
                        lat: window.horoscope_info[0].latitude,
                        lng: window.horoscope_info[0].longitude,
                        place: window.horoscope_info[0].place,
                        date: window.horoscope_info[0].date.replace(" ", "+").replace(":", "-"),
                        timeRadio:
                          12 <= parseInt(window.horoscope_info[0].date.split(" ")[1].split(":")[0])
                            ? "pm"
                            : "am",
                        r: "bb",
                      }
                    : {
                        name_1: window.horoscope_info1.name,
                        lat_1: window.horoscope_info1.latitude,
                        lng_1: window.horoscope_info1.longitude,
                        place_1: window.horoscope_info1.place,
                        date_1: window.horoscope_info1.date.replace(" ", "+").replace(":", "-"),
                        timeRadio_1:
                          12 <= parseInt(window.horoscope_info1.date.split(" ")[1].split(":")[0])
                            ? "pm"
                            : "am",
                        name_2: window.horoscope_info2.name,
                        lat_2: window.horoscope_info2.latitude,
                        lng_2: window.horoscope_info2.longitude,
                        place_2: window.horoscope_info2.place,
                        date_2: window.horoscope_info2.date.replace(" ", "+").replace(":", "-"),
                        timeRadio_2:
                          12 <= parseInt(window.horoscope_info2.date.split(" ")[1].split(":")[0])
                            ? "pm"
                            : "am",
                        r: "ss",
                      },
                )),
            $(this).attr("href", t);
        }),
        "birthchart" == window.charttype &&
          "/chart-of-moment/" != window.location.pathname &&
          ($("#report_name").html(window.horoscope_info[0].name),
          $("#report_birthday").html($("#h_date").html()),
          $("#report_location").html(window.horoscope_info[0].place),
          $("#advanced_report").click(function () {
            $("#report_settings").slideToggle();
          }),
          (window.horoscope_info[0].isSidereal = !1),
          $("#sidereal-report").click(function () {
            window.horoscope_info[0].isSidereal = !window.horoscope_info[0].isSidereal;
          }),
          $(".direct_report").click(function (e) {
            e.preventDefault();
            e = {
              name: t(window.horoscope_info[0].name),
              lat: window.horoscope_info[0].latitude,
              lng: window.horoscope_info[0].longitude,
              place: window.horoscope_info[0].place,
              date: window.horoscope_info[0].date.replace(":", "-"),
              timeRadio:
                12 <= parseInt(window.horoscope_info[0].date.split(" ")[1].split(":")[0])
                  ? "pm"
                  : "am",
              hasBirthTime: window.horoscope_info[0].hasBirthTime,
              isSidereal: window.horoscope_info[0].isSidereal,
              product_type: "your-astrology-birth-chart",
              referral: "new2",
            };
            $.ajax({
              type: "POST",
              url: "/shop/add_product_ajax/",
              data: e,
              success: function (e) {
                window.location = "/shop/payment/";
              },
              statusCode: {
                403: function (e) {
                  $("#error").append(
                    " You need cookies enabled in your browser to add items to your cart! ",
                  ),
                    $("#error").show();
                },
              },
            });
          })),
        "synastry" == window.charttype &&
          ($("#report_name").html(window.horoscope_info1.name),
          $("#report_birthday").html($("#p1_date").html()),
          $("#report_location").html(window.horoscope_info1.place),
          $("#report_name2").html(window.horoscope_info2.name),
          $("#report_birthday2").html($("#p2_date").html()),
          $("#report_location2").html(window.horoscope_info2.place),
          $("#advanced_report").click(function () {
            $("#report_settings").slideToggle();
          }),
          (window.horoscope_info.isSidereal = !1),
          $("#sidereal-report").click(function () {
            window.horoscope_info.isSidereal = !window.horoscope_info.isSidereal;
          }),
          $(".direct_report").click(function (e) {
            e.preventDefault();
            e = {
              name_1: t(window.horoscope_info1.name),
              lat_1: window.horoscope_info1.latitude,
              lng_1: window.horoscope_info1.longitude,
              place_1: window.horoscope_info1.place,
              date_1: window.horoscope_info1.date.replace(":", "-"),
              timeRadio_1:
                12 <= parseInt(window.horoscope_info1.date.split(" ")[1].split(":")[0])
                  ? "pm"
                  : "am",
              hasBirthTime_1: window.horoscope_info1.hasBirthTime,
              name_2: t(window.horoscope_info2.name),
              lat_2: window.horoscope_info2.latitude,
              lng_2: window.horoscope_info2.longitude,
              place_2: window.horoscope_info2.place,
              date_2: window.horoscope_info2.date.replace(":", "-"),
              timeRadio_2:
                12 <= parseInt(window.horoscope_info2.date.split(" ")[1].split(":")[0])
                  ? "pm"
                  : "am",
              hasBirthTime_2: window.horoscope_info2.hasBirthTime,
              isSidereal: window.horoscope_info.isSidereal,
              product_type: "your-synastry-chart",
              referral: "new2",
            };
            $.ajax({
              type: "POST",
              url: "/shop/add_product_ajax/",
              data: e,
              success: function (e) {
                window.location = "/shop/payment/";
              },
              statusCode: {
                403: function (e) {
                  $("#error").append(
                    " You need cookies enabled in your browser to add items to your cart! ",
                  ),
                    $("#error").show();
                },
              },
            });
          }));
    },
    setup_share_chart: function () {
      var n = _.template(
        "      <% if (info){ %>       <p><%= info %></p>       <% }else{ %>        <p>Use this shortened link to share your chart:</p>      <% } %>    <input class='form-control input' value='<%= url %>' />",
      );
      -1 !== window.location.href.indexOf("/chart/")
        ? $("#share-chart").click(function () {
            var e;
            $("#share-chart-overlay").modal("show"),
              window.user && "persons" != window.sub_charttype
                ? ((e = (
                    "birthchart" == window.charttype
                      ? window.horoscope_info[0]
                      : window.horoscope_info
                  ).id),
                  $.ajax({
                    type: "POST",
                    url: "/user/ispublic_chart_ajax/",
                    data: { chartid: e, isPublic: !0, charttype: window.charttype },
                    success: function (e) {
                      $("#short-url").html(
                        n({
                          url: window.location.href,
                          info: "This chart is now viewable to anyone with a link.",
                          user: !1,
                        }),
                      );
                    },
                  }))
                : $("#short-url").html(
                    n({ url: window.location.href, info: "Use this link:", user: !1 }),
                  );
          })
        : $("#share-chart").click(function () {
            var e, t;
            $("#share-chart-overlay").modal("show"),
              $("#short-url").hasClass("complete") ||
                ("birthchart" == window.charttype
                  ? ((t = JSON.stringify(window.horoscope_info)),
                    $.ajax({
                      type: "POST",
                      url: "/tools/share_chart_ajax/",
                      data: { h: t, charttype: "birthchart" },
                      success: function (e) {
                        $("#short-url").html(
                          n({
                            url: window.location.host + "/chart/" + e,
                            info: !1,
                            user: window.user,
                          }),
                        ),
                          $("#short-url").addClass("complete");
                      },
                    }))
                  : ("composite" != window.charttype && "synastry" != window.charttype) ||
                    ((e = JSON.stringify(window.horoscope_info1)),
                    (t = JSON.stringify(window.horoscope_info2)),
                    $.ajax({
                      type: "POST",
                      url: "/tools/share_chart_ajax/",
                      data: { h1: e, h2: t, charttype: window.charttype },
                      success: function (e) {
                        $("#short-url").html(
                          n({
                            url: window.location.host + "/chart/" + window.charttype + "/" + e,
                            info: !1,
                            user: window.user,
                          }),
                        ),
                          $("#short-url").addClass("complete");
                      },
                    })));
          });
    },
    setup_save_chart: function () {
      (e =
        "birthchart" == window.charttype
          ? JSON.stringify({ charttype: window.charttype, h: window.horoscope_info[0] })
          : JSON.stringify({
              charttype: window.charttype,
              h1: window.horoscope_info1,
              h2: window.horoscope_info2,
            })),
        $("#horoscope_info").val(e);
      var e = $("#google-oauth2-button").attr("href");
      (e += window.location.search.replace(/_1/g, "").replace(/_2/g, "2")),
        (e += "&charttype=" + window.charttype),
        $("#google-oauth2-button").attr("href", e),
        $(".save-chart").click(function () {
          var e, t;
          window.user
            ? "birthchart" == window.charttype
              ? ((t = JSON.stringify(window.horoscope_info)),
                $.ajax({
                  type: "POST",
                  url: "/user/save_chart_ajax/",
                  data: { h: t },
                  success: function (e) {
                    $("#chart-saved-overlay").modal("show");
                  },
                }))
              : ((e = JSON.stringify(window.horoscope_info1)),
                (t = JSON.stringify(window.horoscope_info2)),
                $.ajax({
                  type: "POST",
                  url: "/user/save_chart_joint_ajax/",
                  data: { h1: e, h2: t, charttype: window.charttype },
                  success: function (e) {
                    $("#chart-saved-overlay").modal("show");
                  },
                }))
            : $("#save-chart-overlay").modal("show");
        });
    },
    enable_settings: function () {
      var e = this;
      $('[data-toggle="checkbox"]').radiocheck(),
        e.enable_house_settings(),
        $(".settings-headline").click(function () {
          var e = $(this).attr("data-open");
          $("#" + e).slideToggle(400);
        }),
        e.enable_general_settings(),
        e.enable_planet_settings(),
        e.enable_aspect_settings(),
        e.enable_orb_settings(),
        $("#apply_chartsettings").click(function () {
          e.eventBus.trigger("reset_chart");
        });
    },
    enable_house_settings: function () {
      function n(e, t) {
        (s.settings.showHouses = t || !s.settings.showHouses),
          (t = "birthchart" != window.charttype || window.horoscope_info[0].hasBirthTime),
          (s.settings.showHouses = s.settings.showHouses && t),
          (t = $("#house-system-setting").find(".name")[0]),
          (t = $(t).html()),
          (t = a[t]),
          (s.settings.house_key = t),
          s.eventBus.trigger("reset_chart");
      }
      var e,
        s = this,
        a = {
          "Placidus (default)": "p",
          Koch: "k",
          "Whole Signs (oldest)": "w",
          "Equal Houses": "e",
          Campanus: "c",
          Regiomontanus: "r",
          Vehlow: "v",
        };
      s.settings.showHouses && $("#house-switch").radiocheck("check"),
        $("#house-switch").change(n),
        $(".h-option").click(function (e) {
          var t = $(e.currentTarget).find("a")[0],
            t = $(t).html(),
            e = $(e.currentTarget).parents(".btn-group")[0],
            e = $(e).find("button")[0],
            e = $(e).find(".name")[0];
          $(e).html(t), n(0, !0), $("#house-switch").radiocheck("check");
        }),
        "house_key" in this.settings &&
          "p" != this.settings.house_key &&
          ((e = _.invert(a)[this.settings.house_key]), $("#house-system-setting .name").html(e));
    },
    enable_general_settings: function () {
      var n = this;
      ("birthchart" != window.charttype && "synastry" != window.charttype) ||
        ((n = this),
        $("#declination-switch").change(function (e) {
          (n.settings.showDeclination = !n.settings.showDeclination),
            n.settings.showDeclination
              ? n.eventBus.trigger("showDeclination")
              : n.eventBus.trigger("hideDeclination");
        }),
        this.settings.showDeclination && $("#declination-switch").radiocheck("check")),
        $(":radio").radiocheck(),
        this.settings.showSidereal
          ? ($("#sidereal_exception").attr("style", "display: block"),
            $("#positions_sidereal").radiocheck("check"))
          : $("#positions_tropical").radiocheck("check"),
        $("#apply_chartsettings").click(function () {
          var e = $("input:radio[name ='positions']:checked").val();
          (n.settings.showSidereal = "sidereal" == e),
            n.settings.showSidereal
              ? $("#sidereal_exception").attr("style", "display: block")
              : $("#sidereal_exception").hide();
        }),
        $("#skin_" + n.settings.skin).radiocheck("check"),
        $("#apply_chartsettings").click(function () {
          n.settings.skin = $("input:radio[name ='skin']:checked").val();
        }),
        "birthchart" == window.charttype &&
          ($("#dst_default").radiocheck("check"),
          $("#apply_chartsettings").click(function () {
            (n.settings.custom_dst = $("input:radio[name ='custom_dst']:checked").val()),
              (n.settings.custom_dst = "false" != n.settings.custom_dst && n.settings.custom_dst);
          }),
          $("#custom_lat").val(window.horoscope_info[0].latitude),
          $("#custom_lng").val(window.horoscope_info[0].longitude),
          $("#apply_chartsettings").click(function () {
            var e = $("#custom_lat").val() != window.horoscope_info[0].latitude,
              t = $("#custom_lng").val() != window.horoscope_info[0].longitude;
            (n.settings.custom_latlng = e || t),
              n.settings.custom_latlng &&
                $("#h_place").html("@" + $("#custom_lat").val() + ", " + $("#custom_lng").val());
          })),
        $("#legend").click(function () {
          $(".legend_box_container").slideToggle(120);
        });
    },
    enable_planet_settings: function () {
      var a = this;
      a.planets_editted = !1;
      for (
        var i = [
            "sun",
            "moon",
            "mercury",
            "venus",
            "mars",
            "jupiter",
            "saturn",
            "uranus",
            "neptune",
            "pluto",
            "north_node",
            "true_node",
            "chiron",
            "ascendant",
            "mc",
            "descendant",
            "ic",
            "lilith",
            "ceres",
            "vesta",
            "juno",
            "pallas",
          ],
          e = a.settings.planets || [
            "sun",
            "moon",
            "mercury",
            "venus",
            "mars",
            "jupiter",
            "saturn",
            "uranus",
            "neptune",
            "pluto",
            "north_node",
            "chiron",
            "ascendant",
            "mc",
          ],
          t = 0;
        t < e.length;
        t++
      ) {
        var n = e[t];
        $("#pl_" + n).radiocheck("check");
      }
      $(".planet-label").click(function () {
        a.planets_editted = !0;
      }),
        $("#apply_chartsettings").click(function () {
          if (a.planets_editted) {
            for (var e = [], t = 0; t < i.length; t++) {
              var n = i[t],
                s = $("#pl_" + n).radiocheck();
              $(s).prop("checked") &&
                ("true_node" == (n = "north_node" == n ? "north node" : n) && (n = "true node"),
                e.push(n));
            }
            a.settings.planets = e;
          }
        });
    },
    enable_aspect_settings: function () {
      var a = this;
      a.aspects_editted = !1;
      for (
        var i = [
            "trine",
            "conjunction",
            "opposition",
            "square",
            "sextile",
            "quintile",
            "septile",
            "octile",
            "novile",
            "semi-sextile",
            "quincunx",
            "sesquiquadrate",
          ],
          e = a.settings.aspects || i,
          t = 0;
        t < e.length;
        t++
      ) {
        var n = e[t];
        $("#a_" + n).radiocheck("check");
      }
      $(".aspect-label").click(function () {
        a.aspects_editted = !0;
      }),
        $("#apply_chartsettings").click(function () {
          if (a.aspects_editted) {
            for (var e = [], t = 0; t < i.length; t++) {
              var n = i[t],
                s = $("#a_" + n).radiocheck();
              $(s).prop("checked") && e.push(n);
            }
            a.settings.aspects = e;
          }
        });
    },
    enable_orb_settings: function () {
      var e = this;
      if (e.settings.custom_orbs) {
        var t = JSON.parse(e.settings.custom_orbs),
          n = t.birth;
        if (n) for (var s in n) Number.isInteger(parseInt(n[s])) && $("#o_" + s).val(n[s]);
        var a = t.synastry;
        if (a) for (var s in a) Number.isInteger(parseInt(a[s])) && $("#o_s_" + s).val(a[s]);
        e.settings.custom_orbs = JSON.stringify(t);
      }
      $("#apply_chartsettings").click(function () {
        var s = { birth: {}, synastry: {} },
          a = !1,
          i = !1;
        $(".orb-input").each(function () {
          var e,
            t = $(this).val(),
            n = $(this).attr("id"),
            t = t ? parseInt(t) : "";
          Number.isInteger(t) &&
            ((e = -1 < n.indexOf("o_s_") ? "synastry" : "birth"),
            (n = -1 < n.indexOf("o_s_") ? n.replace("o_s_", "") : n.replace("o_", "")),
            (s[e][n] = t),
            "synastry" == e && (a = !0),
            "birth" == e && (i = !0));
        }),
          a || (s.synastry = ""),
          i || (s.birth = ""),
          (e.settings.custom_orbs = JSON.stringify(s));
      });
    },
  }),
  Planet_View = Backbone.View.extend({
    el: "#planet_view",
    planet_template: _.template(
      "    <div id='<%= name %>' class='planet'>      <img class='pl_icon' src='<%= imgp %>'>      <div class='p_attr'>        <span class='p_name'><%= cap_name %></span>        <span> in</span>        <span class='p_pos'><%= degree %>&deg; <%= minute %>'</span>        <span class='p_sign'><%= sign.cap_name %> </span>        <span class='p_ret'><% if (retro) { %> (r) <% } %></span>      </div>    </div>",
    ),
    initialize: function (e) {
      (this.collectedMinutes = !1),
        (this.planets = e.planets),
        this.populate_planets(this.planets, 0),
        (this.planet_detailed_open = !1),
        (this.eventBus = e.eventBus),
        ("composite" != window.charttype && "synastry" != window.charttype) ||
          ((e =
            "planets_list" in e.settings &&
            "" != e.settings.planets_list &&
            $.parseJSON(e.settings.planets_list)),
          this.display_individual_planets(e)),
        "birthchart" != window.charttype ||
          window.horoscope_info[0].hasBirthTime ||
          $("#moon_exception").show();
    },
    populate_planets: function (t, n) {
      var s = this;
      "sub_charttype" in window && "persons" == window.sub_charttype
        ? $.ajax({
            type: "GET",
            url: "/tools/get_minutes_ajax/",
            data: {
              date: window.horoscope_info[0].date,
              lat: window.horoscope_info[0].latitude,
              lng: window.horoscope_info[0].longitude,
            },
            success: function (e) {
              s.collectedMinutes = {};
              e = $.parseJSON(e);
              _.each(e, function (e) {
                var t = e[0].toLowerCase(),
                  e = e[3];
                (minute = parseInt(60 * (e - Math.floor(e)))), (s.collectedMinutes[t] = minute);
              }),
                s.populate_planets_text(t, n);
            },
          })
        : s.populate_planets_text(t, n);
    },
    populate_planets_text: function (e, t) {
      (t = 0 == t ? this.$el.find(".planet_brief_box")[0] : this.$el.find(".planet_brief_box")[t]),
        (t = $(t)).html("");
      var n,
        s = "";
      for (n in e) {
        var a = e[n];
        this.collectedMinutes && (a.minute = this.collectedMinutes[n]),
          (s += this.planet_template(a));
      }
      t.append(s);
    },
    cleanup_planets: function (e) {
      var n = {};
      return (
        $.each(e, function (e, t) {
          $(n).attr(
            t[0].toLowerCase(),
            new Planet(t[0].toLowerCase(), {
              sign: t[1].toLowerCase(),
              degree: t[2],
              full_degree: t[3],
              retro: t[4],
            }),
          );
        }),
        n
      );
    },
    display_individual_planets: function (e) {
      0 == $("#p1_planets").length &&
        ((t = $("#p1").html()),
        (n = $("#p2").html()),
        this.$el
          .find(".inner_ibox")
          .append(
            "<div id='p1_planets' class='syn-planets'> <a>" +
              capitalize(t) +
              "'s planets <i class='icon-chevron-r'></i></a></div><div class='two-col-wrap' id='p1_planet_box'><div class='planet_brief_box'></div></div>",
          ),
        this.$el
          .find(".inner_ibox")
          .append(
            "<div id='p2_planets' class='syn-planets'> <a>" +
              capitalize(n) +
              "'s planets <i class='icon-chevron-r'></i></a></div><div class='two-col-wrap' id='p2_planet_box'><div class='planet_brief_box'></div></div>",
          ),
        $("#p1_planets").click(function () {
          var e = $("#p1_planet_box");
          e.is(":visible") ? e.slideUp(200) : e.slideDown(500);
        }),
        $("#p2_planets").click(function () {
          var e = $("#p2_planet_box");
          e.is(":visible") ? e.slideUp(200) : e.slideDown(500);
        }));
      var t = this.cleanup_planets(window.planets_p1),
        n = this.cleanup_planets(window.planets_p2);
      e
        ? ((window.planets_p1_subset = _.pick(t, e)), (window.planets_p2_subset = _.pick(n, e)))
        : ((e = [
            "lilith",
            "pholus",
            "ceres",
            "vesta",
            "juno",
            "pallas",
            "descendant",
            "ic",
            "true node",
          ]),
          (window.planets_p1_subset = _.omit(t, e)),
          (window.planets_p2_subset = _.omit(n, e))),
        this.populate_planets(window.planets_p1_subset, 1),
        this.populate_planets(window.planets_p2_subset, 2),
        "synastry" == window.charttype
          ? ($("#p1_planet_box").show(), $("#p2_planet_box").show())
          : ($("#p1_planet_box").hide(), $("#p2_planet_box").hide());
    },
  }),
  Aspect_View = Backbone.View.extend({
    el: "#aspect_view",
    aspect_template: _.template(
      "    <div><img class='as_icon' src='/client/common/images/aspects/<%= img_name %>.svg'>      <div class='as_text'><div class='aspect_b_link'><%= full_name %></div>        <div class='aspect_b_orb'>orb: <%= orb %> &deg;</div></div>    </div>",
    ),
    initialize: function (e, t) {
      this.populate_aspects(e), this.activate_detailed(t), (this.aspect_detailed_open = !1);
      var t = this.$el.find("#aspects-detailed-link"),
        n = this.$el.find("#aspects-detailed");
      $(t).click(function (e) {
        this.aspect_detailed_open
          ? ($(n).slideUp(), (this.aspect_detailed_open = !1))
          : ($(n).slideDown(1e3), (this.aspect_detailed_open = !0)),
          e.stopPropagation();
      });
    },
    populate_aspects: function (e) {
      var t = this.$el.find(".aspect_brief_box");
      t.html("");
      for (var n = "", s = 0; s < e.length; s++) {
        var a = e[s];
        n += this.aspect_template(a);
      }
      t.append(n);
    },
    activate_detailed: function (e) {
      var t = this.$el.find(".aspect_extended_box");
      t.html("");
      for (var n = "", s = 0; s < e.length; s++) {
        var a = e[s];
        n += this.aspect_template(a);
      }
      t.append(n);
    },
  }),
  Pattern_View = Backbone.View.extend({
    el: "#pattern_view",
    pattern_template: _.template(
      "    <div class='aspect_pattern_box'>      <div class='ap_raphael' id='ap_<%= index %>'></div>      <div class='aspect-info'>        <p class='ap_type'><%= type %></p>        <p class='ap_planets'>          <% _.each(planets, function(planet){ %>            <%= planet %><br/>          <% }); %>        </p>      </div>  </div>",
    ),
    initialize: function (e) {
      this.refreshPatterns(e);
    },
    refreshPatterns: function (e) {
      var t = e.patterns,
        n = e.planets;
      if ((this.populate_patterns(t, n), "synastry" == window.charttype)) {
        0 == t.length && this.$el.hide();
        for (var s = 0; s < t.length; s++)
          e.createSmall("ap_" + s, e.patterns[s].planets, "small_synastry");
      } else
        for (s = 0; s < t.length; s++)
          e.createSmall("ap_" + s, e.patterns[s].planets, "small_birth");
    },
    populate_patterns: function (e, t) {
      var n = this.$el.find(".inner_ibox");
      if ((n.html(""), 0 < e.length)) {
        for (var s = 0; s < e.length; s++) {
          for (var a = e[s], i = [], o = 0; o < a.planets.length; o++) {
            var r = t[a.planets[o]].full_name;
            "synastry" == window.charttype &&
              (r =
                capitalize(
                  (-1 < a.planets[o].indexOf("_p1")
                    ? window.horoscope_info1
                    : window.horoscope_info2
                  ).name,
                ) +
                "'s " +
                r),
              i.push(r);
          }
          var p = { index: s, planets: i, type: a.type },
            p = this.pattern_template(p);
          n.append(p);
        }
        this.$el.show();
      } else this.$el.hide();
    },
  }),
  House_View = Backbone.View.extend({
    el: "#houses_view",
    house_template: _.template(
      "    <div class='planet'>      <div class='p_attr'>        <div class='p_name'><%= name %> </div>        <span>starts at</span>        <div class='p_pos'><%= degree %>&deg; </div>        <div class='p_sign'><%= sign %> </div>        <% if(h_planets){ %>          <div class='house_type'>(Containing <%= h_planets %>)</div>        <% } %>      </div>    </div>",
    ),
    initialize: function (e) {
      this.$el.find(".inner_ibox").hide(),
        (this.planets = e.planets),
        this.populate_houses(e.houses),
        (this.eventBus = e.eventBus),
        this.eventBus.on("show_houses", this.show_houses, this),
        this.eventBus.on("hide_houses", this.hide_houses, this),
        e.settings.showHouses && this.show_houses();
    },
    show_houses: function () {
      this.$el.find(".inner_ibox").show();
    },
    hide_houses: function () {
      this.$el.find(".inner_ibox").hide();
    },
    populate_houses: function (e) {
      var t = this.planets,
        n = this.$el.find(".houses_extended_box");
      n.html("");
      for (
        var s = [
            "1<sup>st</sup>",
            "2<sup>nd</sup>",
            "3<sup>rd</sup>",
            "4<sup>th</sup>",
            "5<sup>th</sup>",
            "6<sup>th</sup>",
            "7<sup>th</sup>",
            "8<sup>th</sup>",
            "9<sup>th</sup>",
            "10<sup>th</sup>",
            "11<sup>th</sup>",
            "12<sup>th</sup>",
          ],
          a = [
            "Aries",
            "Taurus",
            "Gemini",
            "Cancer",
            "Leo",
            "Virgo",
            "Libra",
            "Scorpio",
            "Sagittarius",
            "Capricorn",
            "Aquarius",
            "Pisces",
          ],
          i = 0;
        i < e.length;
        i++
      ) {
        var o = parseInt(e[i]);
        p = i == e.length - 1 ? parseInt(e[0]) : parseInt(e[i + 1]);
        var r = this.get_houses_planets_string(o, p, t),
          p = parseInt(o / 30),
          r = {
            sign: Sign.TYPES[p],
            degree: o % 30,
            name: s[i] + " House",
            realm: a[i],
            h_planets: r,
          },
          r = this.house_template(r);
        n.append(r);
      }
    },
    get_houses_planets: function (e, t, n) {
      var s,
        a = [];
      for (s in n) {
        var i = n[s],
          o = t < e;
        o &&
          ((inEarlyHalf = i.full_degree < t),
          (inLateHalf = i.full_degree >= e),
          (o = inEarlyHalf || inLateHalf)),
          ((i.full_degree >= e && i.full_degree < t) || o) &&
            (_.contains(["Ascendant", "MC", "Descendant", "IC"], i.cap_name) || a.push(i.cap_name));
      }
      return a;
    },
    get_houses_planets_string: function (e, t, n) {
      for (var s = this.get_houses_planets(e, t, n), a = "", i = 0; i < s.length; i++)
        i == s.length - 1
          ? (1 < s.length && ((a = a.slice(0, -2)), (a += " and ")), (a += s[i]))
          : (a += s[i] + ", ");
      return a;
    },
  }),
  Declination_View = Backbone.View.extend({
    el: "#declination_view",
    planet_template: _.template(
      "    <div class='planet'>      <img class='pl_icon' src='<%= imgp %>'>      <div class='p_attr'>        <span class='p_name'><%= planet %></span>        <span>in</span>        <span class='p_pos'><%= dec %>&deg; <%= minutes %>' <%= isNorth %></span>      </div>    </div>",
    ),
    aspect_template: _.template(
      "    <div>      <img class='as_icon' src='/client/common/images/aspects/<%= parallel_img %>.svg'>      <div class='as_text'>      <div class='aspect_b_link'><%= name1 %> <%= parallel %> <%= name2 %></div>      <div class='aspect_b_orb'>orb: <%= orb %></div>      </div>    </div>",
    ),
    initialize: function (e) {
      (this.horoscope = e.horoscope),
        (this.rendered = !1),
        (this.eventBus = e.eventBus),
        this.eventBus.on("showDeclination", this.showDeclination, this),
        this.eventBus.on("hideDeclination", this.hideDeclination, this),
        e.settings.showDeclination && this.showDeclination();
    },
    showDeclination: function () {
      var n = this;
      this.rendered ||
        "birthchart" != window.charttype ||
        $.ajax({
          type: "GET",
          url: "/tools/get_declination_ajax/",
          data: {
            date: window.horoscope_info[0].date,
            lat: window.horoscope_info[0].latitude,
            lng: window.horoscope_info[0].longitude,
          },
          success: function (e) {
            var t = $.parseJSON(e),
              e = n.determine_parallels(t);
            n.render(t, e), (n.rendered = !0);
          },
        }),
        this.rendered || "synastry" != window.charttype || this.showDeclination_forSynastry(),
        this.$el.show(),
        this.$el.find(".hidden_sec_desc").show();
    },
    hideDeclination: function () {
      this.$el.hide(), this.$el.find(".hidden_sec_desc").hide();
    },
    determine_parallels: function (e) {
      for (var t = [], n = 0; n < e.length; n++)
        for (var s = e[n][1], a = n + 1; a < e.length; a++) {
          var i = e[a][1],
            o = Math.abs(s) - Math.abs(i);
          Math.abs(o) < 1 &&
            ((i = (0 <= s && 0 <= i) || (s <= 0 && i <= 0) || Math.abs(s) < 1),
            t.push({
              name1: e[n][0],
              name2: e[a][0],
              parallel: i ? "Parallel" : "Contraparallel",
              parallel_img: i ? "parallel" : "contraparallel",
              orb: Math.abs(o.toFixed(1)),
            }));
        }
      return t;
    },
    render: function (e, t) {
      var i = this,
        n = this.$el.find(".inner_ibox"),
        o = n.find(".planet_brief_box"),
        s = n.find(".aspect_brief_box");
      o.html(""),
        s.html(""),
        _.each(e, function (e) {
          var t = 0 < e[1],
            n = Math.abs(e[1]).toString().split("."),
            s = (60 * parseFloat("." + n[1])).toString().split(".")[0],
            a = e[0].toLowerCase();
          a in i.horoscope.planets &&
            o.append(
              i.planet_template({
                planet: e[0],
                dec: n[0],
                minutes: s,
                isNorth: t ? "N" : "S",
                imgp: i.horoscope.planets[a].imgp,
              }),
            );
        }),
        _.each(t, function (e) {
          e.name1.toLowerCase() in i.horoscope.planets &&
            e.name2.toLowerCase() in i.horoscope.planets &&
            s.append(i.aspect_template(e));
        });
    },
    render_forSynastry: function (e, t, n) {
      var i = this,
        s = this.$el.find(".inner_ibox"),
        a = capitalize(window.horoscope_info1.name) + "'s ",
        o = capitalize(window.horoscope_info2.name) + "'s ",
        r = s.find(".declination_box"),
        p = s.find(".aspect_brief_box");
      r.html(""), p.html("");
      var c = "<div> " + a + " Declinations</div><div class='planet_brief_box'>";
      _.each(e, function (e) {
        var t = 0 < e[1],
          n = Math.abs(e[1]).toString().split("."),
          s = (60 * parseFloat("." + n[1])).toString().split(".")[0],
          a = e[0].toLowerCase();
        a in i.horoscope.planets &&
          (c += i.planet_template({
            planet: e[0],
            dec: n[0],
            minutes: s,
            isNorth: t ? "N" : "S",
            imgp: i.horoscope.planets[a].imgp,
          }));
      }),
        (c += "</div><div> " + o + " Declinations</div><div class='planet_brief_box'>"),
        _.each(t, function (e) {
          var t = 0 < e[1],
            n = Math.abs(e[1]).toString().split("."),
            s = (60 * parseFloat("." + n[1])).toString().split(".")[0],
            a = e[0].toLowerCase();
          a in i.horoscope.planets &&
            (c += i.planet_template({
              planet: e[0],
              dec: n[0],
              minutes: s,
              isNorth: t ? "N" : "S",
              imgp: i.horoscope.planets[a].imgp,
            }));
        }),
        (c += "</div>"),
        r.append(c),
        _.each(n, function (e) {
          e.name1.toLowerCase() in i.horoscope.planets &&
            e.name2.toLowerCase() in i.horoscope.planets &&
            ((e.name1 = "<i>" + a + "</i>" + e.name1),
            (e.name2 = "<i>" + o + "</i>" + e.name2),
            p.append(i.aspect_template(e)));
        });
    },
    showDeclination_forSynastry: function () {
      var s = this;
      $.ajax({
        type: "GET",
        url: "/tools/get_declination_ajax/",
        data: {
          date: window.horoscope_info1.date,
          lat: window.horoscope_info1.latitude,
          lng: window.horoscope_info1.longitude,
        },
        success: function (e) {
          var n = $.parseJSON(e);
          $.ajax({
            type: "GET",
            url: "/tools/get_declination_ajax/",
            data: {
              date: window.horoscope_info2.date,
              lat: window.horoscope_info2.latitude,
              lng: window.horoscope_info2.longitude,
            },
            success: function (e) {
              var t = $.parseJSON(e),
                e = s.determine_parallels_forSynastry(n, t);
              s.render_forSynastry(n, t, e), (s.rendered = !0);
            },
          });
        },
      });
    },
    determine_parallels_forSynastry: function (e, t) {
      for (var n = [], s = 0; s < e.length; s++)
        for (var a = e[s][1], i = 0; i < t.length; i++) {
          var o = t[i][1],
            r = Math.abs(a) - Math.abs(o);
          Math.abs(r) < 0.7 &&
            ((o = (0 <= a && 0 <= o) || (a <= 0 && o <= 0) || Math.abs(a) < 1),
            n.push({
              name1: e[s][0],
              name2: t[i][0],
              parallel: o ? "Parallel" : "Contraparallel",
              parallel_img: o ? "parallel" : "contraparallel",
              orb: Math.abs(r.toFixed(1)),
            }));
        }
      return n;
    },
  }),
  SpecialNotes_View = Backbone.View.extend({
    el: "#special_box",
    template: _.template($("#specials_template").html()),
    initialize: function (e) {
      this.populate(e);
    },
    populate: function (e) {
      var t,
        n = [];
      "sun" in e.planets &&
        "moon" in e.planets &&
        ("composite" != window.charttype && (n = this.moon_phase(e, n)),
        (t = e.get_chart_shape()).hasShape && n.push(["shape", t]),
        (n = this.get_dominant_modes(e, n)),
        (n = this.get_quadrants(e, n)),
        (n = this.get_dominant_pattern_aspects(e, n)),
        (n = this.get_own_signs(e, n))),
        (n = this.specials = { specials: n }),
        this.$el.html(this.template(n));
    },
    moon_phase: function (e, t) {
      var n = e.planets.sun,
        e = e.planets.moon,
        n = n.full_degree + n.minute / 60 - (e.full_degree + e.minute / 60),
        e = Math.abs(n);
      return (
        e < 3 || e < 9
          ? t.push(["moon", "moon-new", "new moon"])
          : Math.abs(180 - e) < 3 || Math.abs(180 - e) < 9
          ? t.push(["moon", "moon-full", "full moon"])
          : Math.abs(90 - e) < 5
          ? 0 < n
            ? t.push(["moon", "moon-last-quarter", "last quarter moon"])
            : t.push(["moon", "moon-first-quarter", "first quarter moon"])
          : Math.abs(270 - e) < 5
          ? 0 < n
            ? t.push(["moon", "moon-first-quarter", "first quarter moon"])
            : t.push(["moon", "moon-last-quarter", "last quarter moon"])
          : Math.abs(n) < 90 && n < 0
          ? t.push(["moon", "moon-waxing-crescent", "waxing crescent moon"])
          : Math.abs(n) < 90 && 0 < n
          ? t.push(["moon", "moon-waning-crescent", "waning crescent moon"])
          : Math.abs(n) < 180 && 90 < Math.abs(n) && 0 < n
          ? t.push(["moon", "moon-waning-gibbous", "waning gibbous moon"])
          : (Math.abs(n) < 180 && 90 < Math.abs(n) && n < 0) ||
            (Math.abs(n) < 270 && 180 < Math.abs(n) && 0 < n)
          ? t.push(["moon", "moon-waxing-gibbous", "waxing gibbous moon"])
          : Math.abs(n) < 270 && 180 < Math.abs(n) && n < 0
          ? t.push(["moon", "moon-waning-gibbous", "waning gibbous moon"])
          : 270 < Math.abs(n) && Math.abs(n) < 360 && 0 < n
          ? t.push(["moon", "moon-waxing-crescent", "waxing crescent moon"])
          : 270 < Math.abs(n) &&
            Math.abs(n) < 360 &&
            n < 0 &&
            t.push(["moon", "moon-waning-crescent", "waning crescent moon"]),
        t
      );
    },
    listcap: function (e) {
      return (e =
        1 ==
        (e = e.map(function (e) {
          return capitalize(e);
        })).length
          ? e[0]
          : 2 < e.length
          ? e.join(", ")
          : e[0] + " and " + e[1]);
    },
    get_dominant_pattern_aspects: function (t, e) {
      var n = {};
      _.each(t.patterns, function (e) {
        e.type in n ? (n[e.type] += 1) : (n[e.type] = 1);
      });
      var s = this.get_dict_max_min(n)[0];
      2 < n[s[0]] &&
        e.push(["dominant_pattern", s, n[s[0]], s[0].toLowerCase().replace(/ /g, "-")]);
      var a,
        i,
        o,
        r,
        p = {},
        c = {},
        l = [],
        h = [],
        d = {},
        u = ["north node", "lilith", "ceres", "vesta", "juno", "pallas", "chiron"],
        w = (a = ["sun", "moon", "mercury", "venus", "mars", "ascendant", "mc"]),
        m = ["trine", "opposition", "conjunction", "square", "sextile"];
      for (i in (_.each(
        ["trine", "conjunction", "opposition", "square", "sextile", "quincunx"],
        function (e) {
          (p[e] = t.aspect_dict[e].length), 0 == t.aspect_dict[e].length && l.push(e);
        },
      ),
      t.planet_dict))
        _.contains(a, i) &&
          ((c[i] = t.planet_dict[i].length),
          0 ==
            (o = _.filter(t.planet_dict[i], function (e) {
              var t = !_.contains(u, e.planet1.name) && !_.contains(u, e.planet2.name),
                e = _.contains(m, e.atype);
              return t && e;
            })).length && h.push(i),
          _.contains(w, i) && (d[i] = o.length));
      return (
        (s = this.get_dict_max_min(p)[0]).length < 3 &&
          7 < p[s[0]] &&
          e.push(["dominant_aspect", this.listcap(s), p[s[0]], s[0]]),
        (s = this.get_dict_max_min(c)[0]).length < 3 &&
          8 < c[s[0]] &&
          ((r = 1 < s.length ? "are" : "is"),
          e.push([
            "dominant_planet_in_aspect",
            this.listcap(s),
            c[s[0]],
            s[0].replace(/ /g, "-"),
            r,
          ])),
        s.length < 3 &&
          5 < d[s[0]] &&
          ((r = 1 < s.length ? "are" : "is"),
          e.push([
            "planet_in_aspect_more_strict",
            this.listcap(s),
            c[s[0]],
            s[0].replace(/ /g, "-"),
            r,
          ])),
        0 < h.length && e.push(["unaspected", this.listcap(h), 0]),
        0 < l.length && e.push(["missing_aspect", this.listcap(l), 0]),
        e
      );
    },
    get_quadrants: function (e, t) {
      var n = { 1: 0, 2: 0, 3: 0, 4: 0, top: 0, bottom: 0, left: 0, right: 0 },
        s = this,
        a = [],
        i = [],
        o = [],
        r = [];
      if ("ascendant" in e.planets && "mc" in e.planets) {
        var p,
          c,
          l,
          h = e.planets.ascendant.full_degree,
          d = e.planets.mc.full_degree;
        for (p in e.planets)
          "ascendant" != p &&
            "mc" != p &&
            ((c = (c = (l = e.planets[p].full_degree) - h) < 0 ? 360 + c : c) < 90
              ? ((n[1] += 1), (n.bottom += 1), (n.left += 1))
              : c < 180
              ? ((n[2] += 1), (n.bottom += 1), (n.right += 1))
              : c < 270
              ? ((n[3] += 1), (n.top += 1), (n.right += 1))
              : ((n[4] += 1), (n.top += 1), (n.left += 1)),
            (c < 5 || 345 < c) && a.push(p),
            175 < c && c < 195 && i.push(p),
            170 < (l = (l = l - d) < 0 ? 360 + l : l) && l < 190 && r.push(p),
            (350 < l || l < 10) && o.push(p));
        var u = ["bottom left", "bottom right", "top right", "top left"],
          w = !1;
        function m(e) {
          var t = 1 == e.length ? " is " : " are ";
          return (e = s.listcap(e) + t);
        }
        _.each(["1", "2", "3", "4"], function (e) {
          6 < parseInt(n[e]) &&
            (t.push(["quadrant", u[e - 1], u[e - 1].replace(/ /g, "-"), n[e]]), (w = !0)),
            0 == parseInt(n[e]) &&
              t.push(["empty_quadrant", u[e - 1], u[e - 1].replace(/ /g, "-"), n[e - 1]]);
        }),
          _.each(["top", "bottom", "left", "right"], function (e) {
            w || (8 < parseInt(n[e]) && t.push(["hemisphere", e, n[e]])),
              0 == parseInt(n[e]) && t.push(["empty_hemisphere", e, n[e]]);
          });
        var f = "";
        0 < a.length && (f += m(a) + " rising"),
          0 < i.length && (0 < f.length && (f += "; "), (f += m(i) + " descending ")),
          0 < f.length && t.push(["ris_desc", f]);
        f = "";
        0 < o.length && (f += m(o) + " on the Midheaven"),
          0 < r.length && (0 < f.length && (f += "; "), (f += m(r) + " on the Nadir ")),
          0 < f.length && t.push(["mcic", f]);
      }
      return t;
    },
    get_dict_max_min: function (e) {
      var t,
        n = 0,
        s = [],
        a = 100,
        i = [];
      for (t in e)
        e[t] > n ? ((s = [t]), (n = e[t])) : e[t] == n && s.push(t),
          e[t] < a ? ((i = [t]), (a = e[t])) : e[t] == a && i.push(t);
      return [s, i];
    },
    get_own_signs: function (e, t) {
      var n = {
          sun: "leo",
          moon: "cancer",
          mercury: "gemini",
          venus: "libra",
          mars: "aries",
          jupiter: "sagittarius",
          saturn: "capricorn",
          uranus: "aquarius",
          neptune: "pisces",
          pluto: "scorpio",
        },
        s = [],
        a = {
          aries: "mars",
          taurus: "venus",
          gemini: "mercury",
          cancer: "moon",
          leo: "sun",
          virgo: "mercury",
          libra: "venus",
          scorpio: "pluto",
          sagittarius: "jupiter",
          capricorn: "saturn",
          aquarius: "uranus",
          pisces: "neptune",
        },
        i = ["sun", "moon", "mercury", "venus", "mars", "jupiter"],
        o = [],
        r = {};
      for (h in e.planets) {
        (m = e.planets[h].sign.name) == n[h] && s.push([h, m]);
        var p,
          c = a[m];
        null == c ||
          c == h ||
          _.contains(o, h) ||
          ((other_sign = e.planets[c].sign.name),
          a[other_sign] == h
            ? ((v = capitalize(h) + " in " + capitalize(m)),
              (p = capitalize(c) + " in " + capitalize(other_sign)),
              t.push(["mutual_reception", v, p]),
              o.push(c))
            : _.contains(i, h) &&
              _.each(e.planet_dict[h], function (e) {
                var t;
                (e.planet1.name != c && e.planet2.name != c) ||
                  ((t = capitalize(c) + " in " + capitalize(other_sign)),
                  (e = capitalize(h) + " in " + capitalize(m)),
                  t in r ? r[t].push(e) : (r[t] = [e]));
              }));
      }
      for (p in r) var l = 1 < (v = r[p]).length ? "aspect their own" : "aspects its own";
      if (0 < s.length) {
        var h,
          d,
          u = [];
        for (h in e.planets)
          for (var w = []; !_.contains(w, h); ) {
            w.push(h);
            var m,
              f = a[(m = e.planets[h].sign.name)];
            if (f == h) {
              _.contains(u, h) || u.push(h);
              break;
            }
            if (_.contains(w, f)) {
              _.contains(u, "mutual") || u.push("mutual");
              break;
            }
            h = f;
          }
        _.contains(u, "mutual") ||
          1 != u.length ||
          ((h = u[0]),
          (m = e.planets[h].sign.cap_name),
          (d = e.planets[h].cap_name + " in " + m),
          t.push(["sole_dispositor", d]),
          (d = s.indexOf(h)),
          s.splice(d, 1));
      }
      if (0 < s.length) {
        for (var g = 0; g < s.length; g++) {
          var v = capitalize(s[g][0]) + " in " + capitalize(s[g][1]);
          s[g] = v;
        }
        l =
          1 < s.length ? "are in the signs of their rulership." : "is in the sign of its rulership";
        t.push(["own_signs", this.listcap(s), l]);
      }
      return t;
    },
    get_dominant_modes: function (e, t) {
      var n,
        s = {
          fire: ["aries", "leo", "sagittarius"],
          earth: ["virgo", "taurus", "capricorn"],
          water: ["pisces", "cancer", "scorpio"],
          air: ["libra", "gemini", "aquarius"],
        },
        a = {
          mutable: ["virgo", "pisces", "sagittarius", "gemini"],
          cardinal: ["libra", "aries", "capricorn", "cancer"],
          fixed: ["taurus", "scorpio", "leo", "aquarius"],
        },
        i = { fire: 0, water: 0, air: 0, earth: 0 },
        o = { cardinal: 0, mutable: 0, fixed: 0 },
        r = {},
        p = ["sun", "ascendant", "moon", "mercury", "venus", "mars", "jupiter", "mc"],
        c = [];
      for (n in e.planets) {
        if (_.contains(p, n)) {
          var l = e.planets[n];
          for (h in i) _.contains(s[h], l.sign.name) && (i[h] += 1);
          for (v in o) _.contains(a[v], l.sign.name) && (o[v] += 1);
          l.sign.name in r ? (r[l.sign.name] += 1) : (r[l.sign.name] = 1);
        }
        e.planets[n].retro && c.push(n);
      }
      var h,
        d = this.get_dict_max_min(i),
        u = d[0],
        w = d[1],
        m = this.get_dict_max_min(r),
        f = m[0],
        d = (m[1], this.get_dict_max_min(o)),
        m = d[0],
        d = d[1],
        g = !0;
      for (h in i) 2 != i[h] && (g = !1);
      g && t.push(["even_elements", i, 0]),
        1 == u.length && 4 <= i[u[0]] && t.push(["max_element", this.listcap(u), i[u[0]], u[0]]),
        0 == i[w[0]] && t.push(["min_element", this.listcap(w), i[w[0]], w[0]]);
      var v,
        g = !0;
      for (v in o) (o[v] < 2 || 3 < o[v]) && (g = !1);
      return (
        g && t.push(["even_modes", o, 0]),
        1 == m.length && 4 <= o[m[0]] && t.push(["max_mode", this.listcap(m), o[m[0]], m[0]]),
        0 == i[d[0]] && t.push(["min_mode", this.listcap(d), o[d[0]], m[0]]),
        3 < r[f[0]] && t.push(["max_sign", this.listcap(f), r[f[0]], f[0]]),
        5 < c.length && t.push(["many_retrogrades", this.listcap(c), c.length]),
        t
      );
    },
  }),
  Descriptions_View = Backbone.View.extend({
    el: "#description_box",
    template: _.template(
      "    <div class='synastry-desc synastry-desc-<%= ind %>' >      <div class='planet-icons planet-icons2'>        <img src='/client/common/images/planets/<%= p1 %>.svg' class='planet-icon2'>        <img src='/client/common/images/aspects/<%= atype %>.png' class='aspect-icon'>        <img src='/client/common/images/planets/<%= p2 %>.svg' class='planet-icon2'>      </div>      <div class='desc'> </div>     </div>",
    ),
    birth_template: _.template(
      "    <div id='aspect_interp_<%= index %>' class='aspect_interp_box'>      <div class='planet-icons planet-icons2'><span class='name2'><%= full_name %></span>        <img src='/client/common/images/planets/<%= planet1 %>.svg' class='planet-icon2'>        <img src='/client/common/images/aspects/<%= aspectType %>.png' class='aspect-icon'>        <img src='/client/common/images/planets/<%= planet2 %>.svg' class='planet-icon2'>      </div>      <div class='ai_info'>        <div class='name'><%= full_name %></div>        <div class='desc'><%= desc %></div>        <a href='/shop/your-astrology-birth-chart?r=bdes&<%= params %>' class='blink'>Order your report for more!</a><br/>      </div>    </div>",
    ),
    initialize: function (e) {
      "birthchart" == window.charttype && this.initialize_birthchart(e),
        "synastry" == window.charttype && this.initialize_synastry(e);
    },
    initialize_birthchart: function (e) {
      var n = [
          "north node",
          "chiron",
          "mc",
          "saturn",
          "lilith",
          "ceres",
          "vesta",
          "juno",
          "pallas",
          "ascendant",
        ],
        s = ["trine", "opposition", "conjunction", "square"],
        t = _.filter(e.aspects, function (e) {
          var t = !_.contains(n, e.planet1.name) && !_.contains(n, e.planet2.name),
            e = _.contains(s, e.atype);
          return t && e;
        });
      (t = (t = _.sortBy(t, "orb")).splice(0, 1)), this.render_birthchart(t, e);
    },
    get_birth_chart_params: function () {
      var e = window.location.search.replace("?", "&");
      return (e =
        e ||
        (function (e) {
          var t,
            n = [];
          for (t in e) n.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
          return n.join("&");
        })({
          name: window.horoscope_info[0].name,
          lat: window.horoscope_info[0].latitude,
          lng: window.horoscope_info[0].longitude,
          place: window.horoscope_info[0].place,
          date: window.horoscope_info[0].date.replace(" ", "+").replace(":", "-"),
          timeRadio:
            12 <= parseInt(window.horoscope_info[0].date.split(" ")[1].split(":")[0]) ? "pm" : "am",
          r: "bb",
        }));
    },
    render_birthchart: function (e, t) {
      for (var n = this, s = 0; s < e.length; s++) {
        var a = e[s];
        $.ajax({
          type: "GET",
          url: "/reports/get_aspect_ajax/",
          ind: s,
          aspect: a,
          template: n.birth_template,
          data: { p1: a.planet1.cap_name, p2: a.planet2.cap_name, atype: "aspect" },
          success: function (e) {
            0 < e.length &&
              ((e = e.replace(/\n\n/g, "<br/><br/>")),
              (e = {
                index: this.j,
                full_name: this.aspect.full_name,
                orb: this.aspect.orb,
                desc: e,
                planet1: this.aspect.planet1.name,
                planet2: this.aspect.planet2.name,
                aspectType: this.aspect.atype,
                params: n.get_birth_chart_params(),
              }),
              (e = this.template(e)),
              n.$el.append(e));
          },
        });
      }
    },
    get_synastry_params: function () {
      var e = window.location.search.replace("?", "&");
      return (e =
        e ||
        (function (e) {
          var t,
            n = [];
          for (t in e) n.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
          return n.join("&");
        })({
          name: window.horoscope_info1.name,
          lat: window.horoscope_info1.latitude,
          lng: window.horoscope_info1.longitude,
          place: window.horoscope_info1.place,
          date: window.horoscope_info1.date.replace(" ", "+").replace(":", "-"),
          timeRadio:
            12 <= parseInt(window.horoscope_info1.date.split(" ")[1].split(":")[0]) ? "pm" : "am",
          name2: window.horoscope_info2.name,
          lat2: window.horoscope_info2.latitude,
          lng2: window.horoscope_info2.longitude,
          place2: window.horoscope_info2.place,
          date2: window.horoscope_info2.date.replace(" ", "+").replace(":", "-"),
          timeRadio2:
            12 <= parseInt(window.horoscope_info2.date.split(" ")[1].split(":")[0]) ? "pm" : "am",
          r: "ss",
        }));
    },
    initialize_synastry: function (e) {
      var s = ["venus", "ascendant"],
        a = ["venus", "ascendant", "jupiter"],
        i = ["venus", "ascendant", "mars", "jupiter", "moon"],
        o = ["north node", "chiron", "mc", "saturn", "lilith", "ceres", "vesta", "juno", "pallas"],
        r = ["trine", "opposition", "conjunction", "square"],
        t = _.sortBy(e.aspects, function (e) {
          var t = !_.contains(o, e.planet1.name) && !_.contains(o, e.planet2.name),
            n = _.contains(r, e.atype);
          return t && n
            ? _.contains(s, e.planet1.name) && _.contains(s, e.planet2.name)
              ? 7
              : _.contains(a, e.planet1.name) && _.contains(a, e.planet2.name)
              ? 4
              : _.contains(i, e.planet1.name) && _.contains(i, e.planet2.name)
              ? 2
              : 1
            : -1;
        });
      t.reverse();
      for (var n = t.splice(0, 1), p = 1; p < t.length; p++) {
        var c = t[p],
          l = n[0],
          h = c.planet1.name == l.planet1.name || c.planet1.name == l.planet2.name,
          l = c.planet2.name == l.planet1.name || c.planet2.name == l.planet2.name;
        if (!h || !l) {
          n.push(c);
          break;
        }
      }
      this.render_synastry(n, e);
    },
    render_synastry: function (e, t) {
      for (var i = this, n = "", s = [], a = 0; a < 1; a++) {
        var o = capitalize(window.horoscope_info1.name),
          r = capitalize(window.horoscope_info2.name),
          p = [
            "sun",
            "moon",
            "mercury",
            "venus",
            "mars",
            "jupiter",
            "saturn",
            "uranus",
            "neptune",
            "pluto",
            "north_node",
            "chiron",
            "ascendant",
            "mc",
            "descendant",
            "ic",
            "lilith",
            "ceres",
            "vesta",
            "juno",
            "pallas",
          ],
          p = p.indexOf(e[a].planet1.name) > p.indexOf(e[a].planet2.name),
          r = {
            aspect: e[a].full_name,
            ind: a,
            p1: e[a].planet1.name,
            p2: e[a].planet2.name,
            atype: e[a].atype,
            p1name: p ? r : o,
            p2name: p ? o : r,
          };
        (n += this.template(r)), s.push(r);
      }
      t.set_up_for_reports(), this.$el.html(n);
      var c = JSON.stringify(s);
      $.ajax({
        type: "POST",
        url: "/reports/external_get_synastry_ajax/",
        data: { aspects: c },
        aspects: s,
        horoscope: t,
        success: function (e) {
          var t,
            n = $.parseJSON(e);
          for (t in n) {
            var s = n[t],
              a = this.aspects[parseInt(t)];
            (s = (s = (s = (s = s.replace(/<aspect-name>/g, a.atype)).replace(
              /<aspect>/g,
              a.aspect,
            )).replace(/<p1>/g, a.p1name)).replace(/<p2>/g, a.p2name)),
              (params = i.get_synastry_params());
            a =
              '<a href="/shop/your-synastry-chart?r=des&' +
              params +
              '" class="synlink">Get my full report now <span class="icon fa fa-angle-right"></span></a>';
            $(".synastry-desc-" + t + " .desc").html(s + a);
          }
        },
      });
    },
  });
$(window).load(function () {
  new Horoscope_Package();
});
