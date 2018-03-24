export default {
  methods: {
    parseContents(content) {
      // Getting config data from localStorage
      // Config data is retreived using actGetConfig API Call
      var altConfig = JSON.parse(localStorage.getItem('altConfig'));
      // Getting user information from localStorage if present, unless value
      // will be undefined
      var altUser = JSON.parse(localStorage.getItem('altUser'));
      // Getting order information from localStorage if present, unless value
      // will be undefined
      var altOrder = JSON.parse(localStorage.getItem('altOrder'));

      // Creating variable to store the parsed result
      var parsedObject = {};
      parsedObject.languageObj = undefined;
      parsedObject.languageList = undefined;
      parsedObject.tvod = { row: undefined, in: undefined };
      parsedObject.pricing = undefined;
      parsedObject._links = undefined;
      /**
      * Tags
      * contentType | mainLanguage | anonymousAccess | nextId
      */

      if (content.tags && content.tags.length) {
        var tagArr = new Array();
        for (var i in content.tags) {
          tagArr.push(content.tags[i].split('-'));
        }

        if (tagArr && tagArr.length) {
          for (var key in tagArr) {
            if (tagArr[key][0] == 'type') {
              parsedObject.contentType = tagArr[key][1];
            }
            if (tagArr[key][0] == 'language') {
              if (parsedObject.mainLanguage) break;

              parsedObject.mainLanguage = (tagArr[key][1]).slice(0, 1).toUpperCase() + (tagArr[key][1]).slice(1);
            }
            if (tagArr[key][0] == 'anonymous') {
              parsedObject.anonymousAccess = true;
            }
            if (tagArr[key][0] == 'next') {
              parsedObject.nextIn = tagArr[key][1];
            }
            if (tagArr[key][0] == 'coming' && tagArr[key][1] == 'soon') {
              parsedObject.comingSoon = true;
            }
            if (tagArr[key][0] == 'no' && tagArr[key][1] == 'show') {
              parsedObject.noShow = true;
            }
            if (tagArr[key][0] == 'kids') {
              parsedObject.kidsContent = true;
            }
            if (tagArr[key][0] == 'series' && tagArr[key][1] == 'tvod') {
              if (tagArr[key][2] == 'in') {
                // parsedObject.tvod.push({ 'row': tagArr[key][3] });
                parsedObject.tvod['in'] = tagArr[key][3];
              }
              if (tagArr[key][2] == 'row') {
                parsedObject.tvod['row'] = tagArr[key][3];
              }
            }
          }
        }
      }

      if (!(parsedObject.contentType)) {
        if (content.latest_episode) {

          if (content.latest_episode.pricing) parsedObject.pricing = content.latest_episode.pricing;

          parsedObject.contentType = 'series';

          if (content.latest_episode.tags) {

            var tagArr = new Array();
            for (var i in content.latest_episode.tags) {
              tagArr.push(content.latest_episode.tags[i].split('-'));
            }

            if (tagArr && tagArr.length) {
              for (var key in tagArr) {
                if (tagArr[key][0] == 'language') {
                  if (parsedObject.mainLanguage) break;

                  parsedObject.mainLanguage = (tagArr[key][1]).slice(0, 1).toUpperCase() + (tagArr[key][1]).slice(1);
                }

                if (tagArr[key][0] == 'anonymous') {
                  parsedObject.anonymousAccess = true;
                }
                if (tagArr[key][0] == 'next') {
                  parsedObject.nextIn = tagArr[key][1];
                }
                if (tagArr[key][0] == 'coming' && tagArr[key][1] == 'soon') {
                  parsedObject.comingSoon = true;
                }
                if (tagArr[key][0] == 'no' && tagArr[key][1] == 'show') {
                  parsedObject.noShow = true;
                }
                if (tagArr[key][0] == 'kids') {
                  parsedObject.kidsContent = true;
                }

                if (tagArr[key][0] == 'series' && tagArr[key][1] == 'tvod') {
                  if (tagArr[key][2] == 'in') {
                    parsedObject.tvod['in'] = tagArr[key][3];
                  }
                  if (tagArr[key][2] == 'row') {
                    parsedObject.tvod['row'] = tagArr[key][3];
                  }
                }

                if (tagArr[key][0] == 'addlangmap') {
                  var langMapArr = tagArr[key];
                  if (langMapArr && langMapArr.length) {
                    var splitLangArr = new Array();
                    for (var i = 1; i < langMapArr.length; i++) {
                      splitLangArr.push(langMapArr[i].split(':'));
                    }
                    parsedObject.languageObj = splitLangArr.reduce((prev, curr) => {
                      prev[curr[0]] = curr[1];

                      return prev;
                    }, {});
                  }
                }
                if (tagArr[key][0] == 'addlang') {
                  var langListArr = tagArr[key];

                  parsedObject.langListArr = langListArr.slice(1);
                }
              }
            }
          }
          if (content.latest_episode.details) {
            if (content.latest_episode.details.director && content.latest_episode.details.director.length) {
              parsedObject.director = this.filterDirectorByDetails(content.latest_episode.details.director);
            }
            if (content.latest_episode.details.cast && content.latest_episode.details.cast.length) {
              parsedObject.cast = this.filterCastByDetails(content.latest_episode.details.cast);
            }
          }

        } else if (content.subtypes) {
          parsedObject.contentType = content.subtypes[0];
        } else {
          parsedObject.contentType = 'series';
        }
      }

      if (!(parsedObject.tvod.in || parsedObject.tvod.row)) {
        parsedObject.tvod = undefined;
      }
      switch (parsedObject.contentType) {
        case 'trailer':
        parsedObject.contentName = 'media';
        parsedObject.contentTitle = 'Trailer';
        break;
        case 'movie':
        parsedObject.contentName = 'media';
        parsedObject.contentTitle = 'Movie';
        break;
        case 'episode':
        parsedObject.contentName = 'episode';
        parsedObject.contentTitle = 'Show';
        break;
        case 'standup':
        parsedObject.contentName = 'show';
        parsedObject.contentTitle = 'Standup';
        break;
        case 'series':
        parsedObject.contentName = 'show';
        parsedObject.contentTitle = 'Show';
        break;
        case 'poster':
        parsedObject.contentName = 'media';
        parsedObject.contentTitle = 'Poster';
        break;
        default:
        parsedObject.contentName = 'show';
        parsedObject.contentTitle = 'Show';
      }
      /**
      * images
      */
      if (content.images) {
        parsedObject.images = this.filterImages(content.images);
      }
      /**
      * cast | director
      */
      if (content.credits && content.credits.length) {
        parsedObject.cast = this.filterCastByCredits(content.credits);
        parsedObject.director = this.filterDirectorByCredits(content.credits);
      } else if (content.details) {
        if (content.details.cast && content.details.cast.length) {
          parsedObject.cast = this.filterCastByDetails(content.details.cast);
        }
        if (content.details.director && content.details.director.length) {
          parsedObject.director = this.filterDirectorByDetails(content.details.director)
        }
      }
      /**
      * distributorId
      */
      if (content.distributorId) {
        parsedObject.distributorId = content.distributorId;
      }
      /**
      * distributorName
      */
      if (content.distributorName) {
        parsedObject.distributorName;
      }
      /**
      * episodeNumber
      */
      if (content.episodeNumber) {
        parsedObject.episodeNumber;
      }
      /**
      * categories
      */
      if (content.genres && content.genres.length) {
        var categoryObj = this.filterCategoryByGenre(content.genres);
        parsedObject.categories = categoryObj.categoryNames;
        parsedObject.mainCategoryName = categoryObj.mainCategoryName;
        parsedObject.mainCategoryId = categoryObj.mainCategoryId;
      } else if (content.categories) {
        var categoryObj = this.filterCategory(content.categories);
        parsedObject.categories = categoryObj.categoryNames;
        parsedObject.mainCategoryName = categoryObj.mainCategoryName;
        parsedObject.mainCategoryId = categoryObj.mainCategoryId;
      }
      /**
      * duration
      */
      if (content.length) {
        parsedObject.durationInSec = parseInt(content.length);
        parsedObject.duration = this.filterDuration(content.length);
      } else if (content.details) {
        if (content.details.length) {
          parsedObject.durationInSec = parseInt(content.details.length);
          parsedObject.duration = this.filterDuration(content.details.length);
        }
      }
      /**
      * shortDescription
      */
      if (content.shortDescription) {
        parsedObject.shortDescription = content.shortDescription;
      } else if (content.descriptions) {
        parsedObject.shortDescription = content.descriptions.default;
      } else {
        parsedObject.shortDescription = undefined;
      }
      /**
      * mediumDescription
      */
      if (content.mediumDescription) {
        parsedObject.mediumDescription = content.mediumDescription;
      } else if (content.medium_descriptions) {
        parsedObject.mediumDescription = content.medium_descriptions.default;
      } else {
        parsedObject.mediumDescription = undefined
      }
      /**
      * longDescription
      */
      if (content.longDescription) {
        parsedObject.longDescription = (content.longDescription).split('\n');
      } else if (content.long_descriptions) {
        parsedObject.longDescription = (content.long_descriptions.default).split('\n');
      } else {
        parsedObject.longDescription = undefined;
      }
      /**
      * parentalControl
      */
      if (content.parentalControl && content.parentalControl.length) {
        parsedObject.parentalControl = content.parentalControl[0];
      }
      /**
      * releaseYear
      */
      if (content.releaseYear) {
        parsedObject.releaseYear = content.releaseYear;
      } else if (content.details) {
        if (content.details.year) {
          parsedObject.releaseYear = content.details.year;
        }
      }
      /**
      * studio
      */
      if (content.details && content.details.studio) {
        parsedObject.studio = content.details.studio;
      }
      /**
      * title
      */
      if (content.title) {
        parsedObject.title = content.title;
      } else if (content.titles) {
        parsedObject.title = content.titles.default;
      }
      /**
      * type
      */
      if (content.type) {
        parsedObject.type = content.type;
      }
      /**
      * subtypes
      */
      if (content.subtypes && content.subtypes.length) {
        parsedObject.subtypes = content.subtypes
      }
      /**
      * contentProvider
      */
      if (content.content_provider) {
        parsedObject.contentProvider = content.content_provider;
      }
      /**
      * dates
      */
      if (content.dates) {
        parsedObject.dates = content.dates;
      }
      /**
      * externalId
      */
      if (content.external_id) {
        parsedObject.externalId = content.external_id;
      }
      /**
      * isFree
      */
      parsedObject.isFree = false;
      parsedObject.userHasAccess = false;
      parsedObject.isFreeContent = false;

      if (content._links) parsedObject._links = content._links;

      if (altUser) {
        if (content.pricing) {
          if (content.pricing.count) {
            for (var product in content.pricing.products) {
              var productItem = content.pricing.products[product];
              if (productItem.prices && productItem.prices.length) {
                for (var price in productItem.prices) {
                  if (productItem.prices[price].is_free) {
                    parsedObject.isFreeContent = true;
                    break;
                  }
                }
              }
            }

            if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {

              if (!(parsedObject.isFreeContent)) {
                var productId = altOrder.subscription.product.id;

                for (var product in content.pricing.products) {
                  var productItem = content.pricing.products[product];
                  if (productItem.id == productId) {
                    parsedObject.userHasAccess = true;
                    break;
                  }
                }
              }
            }

            if (parsedObject.isFreeContent == false) {
              var homeDomain = localStorage.getItem('homeDomain').toLowerCase();

              if (parsedObject.tvod && (homeDomain in parsedObject.tvod)) {
                var singleTvod = undefined;
                if (altOrder && altOrder.tvod && altOrder.tvod.hasOrder) {
                  for (singleTvod in altOrder.tvod.products) {
                    if (altOrder.tvod.products[singleTvod].product.id == parsedObject.tvod[homeDomain]) {
                      parsedObject.userHasAccess = true;
                      break;
                    }
                  }
                }
              }
            }

          } else if (content.pricing.length) {
            for (var price in content.pricing) {
              if (content.pricing[price].is_free) {
                parsedObject.isFreeContent = true;
                break;
              }
            }
            if (!(parsedObject.isFree) && altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
              var productId = altOrder.subscription.product.id;

              for (var price in content.pricing) {
                if (content.pricing[price].product_id == productId) {
                  parsedObject.userHasAccess = true;
                  break;
                }
              }
            }
          }
        }
      } else {
        if (content.pricing && content.pricing.count) {
          if (content.pricing.products.length) {
            for (var product in content.pricing.products) {
              var productItem = content.pricing.products[product];
              if (productItem.prices && productItem.prices.length) {
                for (var price in productItem.prices) {
                  if (productItem.prices[price].is_free) {
                    parsedObject.isFreeContent = true;
                    break;
                  }
                }
              }
            }
            if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
              if (!(parsedObject.isFreeContent)) {
                var productId = altOrder.subscription.product.id;

                for (var product in content.pricing.products) {
                  var productItem = content.pricing.products[product];
                  if (productItem.id == productId) {
                    parsedObject.userHasAccess = true;
                    break;
                  }
                }
              }
            }
          }
        } else if (content.pricing && content.pricing.length) {
          for (var price in content.pricing) {
            if (content.pricing[price].is_free) {
              parsedObject.isFree = true;
              parsedObject.isFreeContent = true;
              break;
            }
          }
        }
      }

      if (content.pricing && content.pricing.count) parsedObject.pricing = content.pricing.products;

      /**
      * stats
      */
      if (content.stats) {
        parsedObject.stats = content.stats;
      }
      /**
      * trailer
      */
      if (content.trailers && content.trailers.length) {
        parsedObject.trailer = this.filterTrailer(content.trailers[0]);
        parsedObject.trailerAvailable = true;
      } else {
        parsedObject.trailer = undefined;
        parsedObject.trailerAvailable = false;
      }
      /**
      * streams
      */
      if (content.streams && content.streams.web && content.streams.web.length) {
        parsedObject.stream = this.filterStreams(content.streams.web);
        parsedObject.streamAvailable = true;
      } else {
        parsedObject.stream = undefined;
        parsedObject.streamAvailable = false;
      }

      if (parsedObject.contentType == 'trailer') {
        if (parsedObject.trailer) {
          parsedObject.userHasAccess = true;
        }
        if (content.uid) {
          parsedObject.id = content.uid.split('-')[1];
          parsedObject.contentId = content.uid.split('-')[1];
          parsedObject.uidType = content.uid.split('-')[0];
        } else if (content.id) {
          parsedObject.id = content.id;
          parsedObject.contentId = content.id;
          parsedObject.uidType = undefined;
        }
      }

      if (parsedObject.contentType == 'movie') {
        if (content.id) {
          parsedObject.id = content.id;
          parsedObject.contentId = content.id;
        } else if (content.uid) {
          parsedObject.id = content.uid.split('-')[1];
          parsedObject.uidType = content.uid.split('-')[0];
        }
      } else if (parsedObject.contentType == 'episode') {
        if (content.series && content.series.length) {
          parsedObject.seriesTitle = content.series[0].titles && content.series[0].titles.default;
          parsedObject.episodeNumber = content.series[0].episode_number;
          parsedObject.contentId = content.series[0].episode_id;
          parsedObject.episodeId = content.series[0].episode_id;
          parsedObject.seriesId = content.series[0].id;
          parsedObject.seasonId = content.series[0].season_id;
          parsedObject.seasonNumber = content.series[0].season_number;

          var firstSeries = content.series[0];
          if (firstSeries.seasons && firstSeries.seasons.length) {
            var slctdSeason = firstSeries.seasons[0];

            if (slctdSeason) {
              parsedObject.seasonId = slctdSeason.id;
              parsedObject.seasonNumber = slctdSeason.season_number;

              if (slctdSeason.episodes && slctdSeason.episodes.length) {
                var optEpisode = slctdSeason.episodes[0];
                parsedObject.episodeId = optEpisode.id;
                parsedObject.episodeNumber = optEpisode.episode_number;
              }
            }
          }
        }

        if (content.id) {
          parsedObject.id = content.id;
          parsedObject.contentId = content.id;
        }

        if (content.media_id) {
          parsedObject.id = content.media_id;
          parsedObject.mediaId = content.media_id;
        }
      } else {
        if (parsedObject.trailer) {
          parsedObject.userHasAccess = true;
        }
        if (content.uid) {
          parsedObject.id = content.uid.split('-')[1];
          parsedObject.seriesId = content.uid.split('-')[1];
          parsedObject.uidType = content.uid.split('-')[0];
        } else if (content.id) {
          parsedObject.id = content.id;
          parsedObject.seriesId = content.id;
          parsedObject.uidType = undefined;
        }
        if (content.latest_episode) {
          if (!(parsedObject.releaseYear) && content.latest_episode.details && content.latest_episode.details.year) {
            parsedObject.releaseYear = content.latest_episode.details.year;
          }

          if (!(parsedObject.mainLanguage) && content.latest_episode.tags && content.latest_episode.tags.length) {

            var latestTagArr = new Array();
            for (var i in content.latest_episode.tags) {
              latestTagArr.push(content.latest_episode.tags[i].split('-'));
            }
            if (latestTagArr && latestTagArr.length) {
              for (var key in latestTagArr) {
                if (latestTagArr[key][0] == 'language') {
                  if (parsedObject.mainLanguage) break;

                  parsedObject.mainLanguage = (latestTagArr[key][1]).slice(0, 1).toUpperCase() + (latestTagArr[key][1]).slice(1);
                }
              }
            }
          }
        }
      }

      return parsedObject;
    },
  }
}
