<template>
    <div class="feat-card" @click="getContentToPlay(0)">
        <div class="detail" v-if="firstContent">
            <p v-if="firstContent.comingSoon" class="alt-tag">Coming Soon</p>
            <!-- <p v-if="firstContent.isFree" class="alt-tag">Free</p> -->
            <p v-show="isFreeContent(firstContent) && !(firstContent.progress) && !(firstContent.comingSoon)" class="alt-tag">Free</p>
            <p v-if="firstContent.progress" class="alt-tag">
                <span v-if="firstContent.progress != 100">watching</span>
                <span v-else>watched</span>
            </p>
            <h2 v-if="firstContent.title">{{firstContent.title}}</h2>
            <p v-if="firstContent.shortDescription" class="short-desc">{{firstContent.shortDescription}}</p>
            <ul class="info-tags">
                <!-- NOTE added by sumit hide show from watching list kids 03.01.2018 -->
                <li v-if="firstContent.seasonNumber && !firstContent.noShow">S{{firstContent.seasonNumber}}</li>
                <li v-if="firstContent.episodeNumber && !firstContent.noShow">E{{firstContent.episodeNumber}}</li>
                <li v-if="firstContent.contentTitle && !firstContent.episodeNumber">{{firstContent.contentTitle}}</li>
                <li v-if="firstContent.duration">{{firstContent.duration}}</li>
                <li v-if="firstContent.mainCategoryName">{{firstContent.mainCategoryName}}</li>
                <li v-if="firstContent.mainLanguage">{{firstContent.mainLanguage}}</li>
            </ul>
        </div>

        <progressive-img v-if="firstContent.images && firstContent.images.cover" :src="firstContent.images.cover" alt="alt-poster" placeholder="/src/assets/alt-cover.jpg" />

        <!-- <img v-if="firstContent && firstContent.images && firstContent.images.cover" :src="firstContent.images.cover" alt="alt-cover">
        <img v-else src="../../assets/alt-cover.jpg" alt="alt-cover"> -->
        <div v-if="firstContent && firstContent.progress && firstContent.progress != 100" class="line-progress">
            <div class="progress" :style="{ width: firstContent.progress + '%' }"></div>
        </div>
        <div v-else class="color-line sm"></div>
    </div>
</template>

<script>
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            altUser: undefined,
            altOrder: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'firstContent',
            'homeActiveSectionTitle',
        ]),
    },
    methods: {
        ...mapMutations([
            'setPlayerContent'
        ]),
        getContentToPlay(index) {
            // console.log('[HomeFeatured | getContentToPlay | ]');

            this.toggleLoader(true);

            this.setPlayerContent(this.firstContent);

            var routerObj = {
                name: this.firstContent.contentName,
                params: {
                    id: this.firstContent.id
                }
            }

            // For AWS Mobile SDK Events
            localStorage.setItem('AWSMA_content_source', 'section');

            // console.log('[HomeFeatured | getContentToPlay | routerObj ]', routerObj);

            this.$router.push(routerObj);

            // NOTE: End of Code for URL change
        },
        isFreeContent(content) {
            // console.log('[HomeFeatured | isFreeContent | content | ]', content);
            // console.log('[HomeFeatured | isFreeContent | homeActiveSectionTitle | ]', this.homeActiveSectionTitle);

            if (this.homeActiveSectionTitle == 'Watching') {
                return false;
            }

            if (this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == true) {
                return true;
            } else if (this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == false) {
                return false;
            } else {
                return content.isFreeContent;
            }

            // if (this.altUser && this.altOrder && this.altOrder.hasOrder) {
            //     return false;
            // }
            // return content.isFreeContent;
        }
    },
    created() {
        if (localStorage.getItem('altUser')) {
            this.altUser = JSON.parse(localStorage.getItem('altUser'));
        }
        if (localStorage.getItem('altOrder')) {
            this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }
    },
    mixins: [altMixins]
}
</script>
