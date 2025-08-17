<template>
  <!-- :style="{ insetInlineEnd: props.showContacts ? '0' : '-500px' }" -->
  <div class="page contacts">
    <div class="content">
      <!-- v-if="!globalStore?.loading" -->
      <div 
        :class="['chat_tab ' , {'active' : globalStore?.roomId == item?.id}]" 
        v-for="item in getResult?.data" 
        :key="item?.id" 
        @click="emit('handleEnterRoom' , item?.id)"
      >
        <div class="image grid_image">
          <img
            v-for="member in item?.members"
            :key="member?.id"
            :src="member?.image" loading="lazy" alt="image" />
          <!-- <div :class="['circle' , room.members[0].active ? 'status_circle active' : 'status_circle']"></div> -->
        </div>
        <div class="contact_text">
          <h3>{{item?.group_name ?? item?.members[0]?.name}}</h3>
          <div class="time">{{item?.last_message_created_at}}</div>
          <!-- <p>{{item?.last_message_body}}</p> -->
          <p v-if="item.id == lastMessage?.room_id ? lastMessage?.type == 'image' :item.last_message_type == 'image'">
            <i class="pi pi-camera"></i>
            {{ $t('chats.image') }}
          </p>
          <p v-else-if="item.id == lastMessage?.room_id ? lastMessage?.type == 'file' : item.last_message_type == 'file'">
            <i class="pi pi-file"></i>
            {{ $t('chats.file') }}
          </p>
          <p v-else-if="item.id == lastMessage?.room_id ? lastMessage?.type == 'sound' : item.last_message_type == 'sound'">
            <i class="pi pi-microphone"></i>
            {{ $t('chats.sound') }}
          </p>
          <p v-else>
            {{item.id == lastMessage?.room_id ? lastMessage?.body : item.last_message_body}}
          </p>
        </div>
      </div>
      <!-- <div 
        class="chat_tab" 
        v-for="i in 10" 
        :key="i" 
        v-else
      >
        <div class="image grid_image">
          <Skeleton width="30px" height="30px" style="border-radius: 50%;" v-for="i in 4" :key="i"/>
        </div>
        <div class="contact_text" style="width: 80%;">
          <h3>
            <Skeleton width="100%" height="20px" />
          </h3>
          <p v-for="i in 3" :key="i">
            <Skeleton  width="100%" height="8px"/>
          </p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
  // define globalStore 
  const globalStore = useGlobalStore()

  // define the last message of the user 
  const lastMessage = ref()

  // define props
  const props = defineProps({
    rooms: {
      type: Array,
      default: () => []
    },
    newMsg: {
      type: Object,
      default: () => null,
    },
  })

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()
  
  // define emits
  const emit = defineEmits(['handleEnterRoom'])

  watchEffect(()=>{
    if(getResult?.value?.data?.length == 0){
      emit('handleEnterRoom' , null)
    }
    if(props.newMsg){
      // getMethod('get-rooms', null , true, false);
      lastMessage.value = props.newMsg;
    }
  })


  onMounted(()=>{
    getMethod('get-rooms', null , true, false);
  })
</script>

<style lang="scss" scoped>
.contacts{
  // flex-shrink: 0;
  max-width: 370px;
  width: 100%;
  border-radius: 0 12px 12px 0;
  overflow: hidden;
  max-height: 70vh;
  overflow-y: scroll;
  @media(min-width : 767px){
    display: block !important;
  }
  &::-webkit-scrollbar-thumb{
    width: 1px !important;
    background: $thirdColor;
  }
  .chat_tab{
    @include displayFlex($justify:flex-start , $gap : 5px);
    position: relative;
    padding: 15px 8px;
    transition: 0.6s;
    cursor: pointer;
    &:not(:last-of-type){
      border-bottom: 1px solid #F1F1F1;
    }
    .time{
      position: absolute;
      inset-inline-end: 10px;
      top: 20px;
      font-size: 12px;
      color: #3C3C3C;
    }
    .image{
      @include displayFlex($wrap : wrap , $gap : 10px);
      width: 80px;
      img{
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        position:relative;
        overflow: hidden;
        border-radius: 50%;
        // object-fit: contain;
        object-position: center;
      }
    }
    .message_link{
      text-decoration: underline !important;
    }
    h3{
      font-size: 14px;
      font-weight: 500;
      color: #000;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p{
      @include textTruncate(1);
      font-size: 12px;
      font-weight: 400;
      color: #3C3C3C;
    }
    &:hover,
    &.active{
      background: rgba($mainColor , 0.05);
    }
    .contact_text{
      max-width: 80%;
      h3{
        margin-bottom: 10px;
      }
      p:not(:last-of-type){
        margin-bottom: 5px;
      }
    }
  }
  @media (max-width : 767px){
    position: absolute;
    inset-inline-end: 0;
    top: 0;
    z-index: 1000;
    max-width: 500px;
    width: 100%;
    height: 100%;
    border-radius: 10px !important;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .chat_tab{
      padding: 10px;
      h3{
        font-size: 16px;
      }
      p{
        font-size: 12px;
      }
      .time{
        font-size: 10px;
      }
    }
  }
}
</style>