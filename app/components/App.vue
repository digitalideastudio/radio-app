<template>
    <Page class="page">
        <ActionBar
          flat="true"
          class="action-bar"
        >
            <android>
              <NavigationButton
                icon="res://menu"
                @tap="toggleDrawer"
              />
            </android>
            <ios>
              <NavigationButton
                icon="res://menu"
                ios.position="left"
                @tap="toggleDrawer"
              />
            </ios>
            <Label class="action-bar__title" text="HOPE FM"/>
        </ActionBar>

        <RadSideDrawer ref="drawer">
          <StackLayout
            ~drawerContent
            class="right-bar"
          >
            <Label class="drawer-header" text="Drawer"/>

            <Label class="drawer-item" text="Item 1"/>
            <Label class="drawer-item" text="Item 2"/>
            <Label class="drawer-item" text="Item 3"/>
          </StackLayout>

          <FlexboxLayout
            ~mainContent
            flexDirection="column"
            justifyContent="flex-start"
          >
            <TabView
              ref="tabs"
              v-model="selectedIndex"
              class="tab"
              @selectedIndexChange="tabChange()"
            >
              <TabViewItem
                title="Hope.FM"
              >
                <Label
                  :text="`Content for Tab 1 ${tabIndex}`"
                  class="tab__item-text"
                />
              </TabViewItem>
              <TabViewItem
                title="Голос Надії"
              >
                <Label
                  :text="`Content for Tab 2 ${tabIndex}`"
                  class="tab__item-text"
                />
              </TabViewItem>
            </TabView>

            <StackLayout
              flexGrow="0"
              class="controls"
            >
              <StackLayout class="title-box">
                <Label class="title-box__title">
                  {{ title[1] }}

                </Label>
                <Label class="title-box__sub-title">
                  {{ title[0] }}
                </Label>
              </StackLayout>
              <FlexboxLayout
                alignItems="center"
                justifyContent="center"
                flexGrow="0"
                :class="[
                  'controls__play-btn',
                  {'controls__play-btn--play': !isPlay}
                ]"
                @tap="togglePlay"
              >
                <Label
                  v-if="isPlay"
                  class="controls__play-icon fas"
                >&#xf04c;</Label>
                <Label
                  v-else
                  class="controls__play-icon fas"
                >&#xf04b;</Label>
              </FlexboxLayout>
              <VideoPlayer
                ref="nvPlayer"
                controls="false"
                loop="false"
                autoplay="false"
                height="0"
                src="http://stream.hope.ua:7777/hope.fm/256"
              />
            </StackLayout>
          </FlexboxLayout>
        </RadSideDrawer>
    </Page>
</template>

<script>
import { Video } from 'nativescript-videoplayer';

export default {
  data() {
    return {
      title: [],
      selectedIndex: 0,
      tabIndex: 0,
      isPlay: false,
      quality: [256, 128, 64],
      streams: [
        {
          name: 'hope.fm',
          streamUrl: 'http://stream.hope.ua:7777/hope.fm/',
          playingNowUrl: 'http://stream.hope.ua:7777/currentsong?sid=22',
        },
        {
          name: 'voice of hope',
          streamUrl: 'http://stream.hope.ua:7777/golos/',
          playingNowUrl: 'http://stream.hope.ua:7777/currentsong?sid=11',
        },
      ],
      player: null,
      timer: null,
    };
  },
  mounted() {
    this.player = this.$refs.nvPlayer.nativeView;
    this.player.on(Video.playbackStartEvent, () => {
      console.log('playbackStartEvent resp ');
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.player.destroy();
  },
  watch: {
    tabIndex() {
      this.player.src = `${this.streams[this.tabIndex].streamUrl}256`;
      this.title = [];
      this.getTitle();
    },
  },
  methods: {
    toggleDrawer() {
      this.$refs.drawer.nativeView.toggleDrawerState(); // showDrawer();
    },
    tabChange() {
      this.tabIndex = this.selectedIndex.value;
    },
    togglePlay() {
      this.isPlay = !this.isPlay;
      this.getTitle();
      if (this.isPlay) {
        this.player.play();
      } else {
        this.player.pause();
        this.title = [];
        clearInterval(this.timer);
      }
    },
    getTitle() {
      if (!this.title.length) {
        this.getCurrentSong();
      }
      this.timer = setInterval(() => {
        this.getCurrentSong()
      }, 30000);
    },
    getCurrentSong() {
      this.$http
        .getString(this.streams[this.tabIndex].playingNowUrl)
        .then((resp) => {
          // console.log('getCurrentSong', resp);
          this.title = resp.split(' - ');
        })
        .catch((e) => {
          console.log('error ', e)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
    @import '../style/theme';

    .page {
      background-color: $background;
      &--wh {
        background-color: $wh-blue;
      }
    }
    .action-bar {
      background-color: transparent;
      &__title {
        @include fnt($text-invert, 16, $weight-semibold, center);
      }
    }
    .right-bar {
      background-color: $background;

    }
    .tab {
      tab-background-color: $background;
      tab-text-font-size: 10;
      tab-text-color: $grey-middle;
      selected-tab-text-color: $yellow;
      android-selected-tab-highlight-color: $yellow;
      &__item-text {
        @include fnt($text-invert, 20, $weight-normal, center);
        vertical-align: center;
      }
    }
    .controls {
      height: 300;
      &__play-btn {
        height: 80;
        width: 80;
        border-color: $white;
        border-radius: 50%;
        border-width: 2;
        &--play {
          padding-left: 4;
        }
      }
      &__play-icon {
        font-family: 'FontAwesome';
        color: $text-invert;
        font-size: 32;
        text-align: center;
      }
    }
    .title-box {
      height: 50;
      &__title {
        @include fnt($text-invert, 16, $weight-light, center);
      }
      &__sub-title {
        @include fnt($grey-middle, 12, $weight-light, center);
      }
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16;
        // background-color: #53ba82;
        color: $text-invert;
        font-size: 24;
    }

    .drawer-item {
        padding: 8 16;
        color: $text-invert;
        font-size: 16;
    }

    .far {
      font-family: 'Font-Awesome 5 Free', 'fa-regular-400';
      font-weight: 400;
    }
    .fab {
      font-family: 'Font Awesome 5 Brands', 'fa-brands-400';
      font-weight: 400;
    }
    .fas {
      font-family: 'Font Awesome 5 Free', 'fa-solid-900';
      font-weight: 900;
    }
</style>
