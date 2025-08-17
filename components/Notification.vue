<template>
  <div>
    <NuxtLink 
      @click="
        props?.notification?.data?.type == 'new_message' ? 
        globalStore.roomId = props?.notification?.data?.room_id :
        ''
      " 
      :to="
        props?.notification?.data?.type == 'new_message' ? 
        localeRoute(`/chats`) : 
        props?.notification?.data?.type == 'change_complaint_status' ? 
        localeRoute(`/complaints/${props?.notification?.data?.complaint_id}`) : 
        props?.notification?.data?.type == 'admin_info' ? 
        '' : 
        localeRoute(`/researches/${props?.notification?.data?.opportunity_id}`)
      " 
      class="notification">
      <div class="image">
        <img src="/assets/images/logo.png" alt="img" loading="lazy">
      </div>
      <div class="text">
        <h4>{{props?.notification?.notification?.title}}</h4>
        <p>{{props?.notification?.notification?.body}}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
  // define global store
  const globalStore = useGlobalStore()


  // define locale routee
  const localeRoute = useLocaleRoute()

  const props = defineProps({
    notification : {
      type : Object,
      default : () => ({})
    }
  })
</script>

<style lang="scss" scoped>
  .notification{
    position: fixed;
    right: 15px;
    top: 15px;
    width: fit-content;
    display: flex;
    gap: 15px;
    align-items: center;
    z-index: 99999;
    background: #fff;
    box-shadow: 0 0 8px #8b8b8b;
    border-radius: 10px;
    padding: 10px 15px;
    animation-name:pulse;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
    outline: unset !important;
    .image{
      width: 70px;
      height: 77px;
      flex-shrink: 0;
      img{
        object-fit: contain;
      }
    }
    .text{
      h4{
        font-size: 18px;
        font-weight: 500;
      }
      p{
        font-size: 14px;
        font-weight: 300;
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
        width: 245px;
        line-height: 1.2;
        @include textTruncate(3);
      }
    }
  }
</style>