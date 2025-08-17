<template>
  <section class="page">
    <div class="page_header">
      <h3 class="title">{{$t('chats.title')}}</h3>
      <button class="main-btn float_btn" @click="showContacts = !showContacts">
        <i class="pi pi-comments"></i>
      </button>
    </div>
    <div class="chats_page" :style="isUserHasRooms ? 'flex-grow:1;' : ''">
      <!-- v-if="getResult?.data?.room?.private" -->
      <!-- {{console.log(getResult?.data)}} -->
      <!-- :rooms="getResult?.data" -->
      <!-- @handleNewMsg="newMsg = false" -->
      <ChatContacts 
        :newMsg ="newMsg"
        v-show="showContacts"
        @handleEnterRoom="handleEnterRoom"
      />
      <div class="chat_room" :style="!globalStore?.roomId ? 'display:flex;align-items:center;justify-content:center' : ''">
        <div class="page empty-chat" v-if="!globalStore?.roomId">
          <NotFoundEyes />
          <h3>{{$t('chats.empty_text')}}</h3>
        </div>
        <div class="messages" ref="contentEl" v-if="globalStore?.roomId">
          <div 
            v-for="message in messages?.data?.slice()?.reverse()"
            :key="message.id"
            v-if="messages?.data?.length > 0 && !globalStore?.loading"
            :class="['message', message.sender_id == globalStore.user.id ? 'sent_msg' : 'recieved_msg']"
          >
            <div class="image" v-if="message.sender_id != globalStore.user.id">
              <img :src="getResult?.members[0]?.image" alt="image" loading="lazy">
            </div>
            <div class="image" v-else>
              <img :src="globalStore.user.image" alt="image" loading="lazy">
            </div>
            <div class="text" v-if="message.type == 'text'">
              <p>{{ message.body }}</p>
              <!-- 
                THE NEW MESSAGE WHICH RETURNS FROM [NODE] RETURN WITH THE KEY (created_at)
                BUT THE MESSAGES FETCHED FROM [PHP] RETURN WITH THE KEY ( created_dt )
              -->
              <p class="time">{{ message.created_at ?? message.created_dt }}</p>
            </div>
            <div class="image message_image"   v-else-if="message.type == 'image'">
              <!-- <img :src="message.body" alt="image" loading="lazy"> -->
              <Image :src="message.body" style="width:100%;height: 100%;" alt="Image" preview />
            </div>
            <a 
              class="image pdf_file" 
              :href="message.body" 
              target="_blank" 
              v-else-if="message.type == 'file'">
              <img src="/assets/images/pdf.png" alt="image" loading="lazy">
            </a>
            <div class="audio" v-else-if="message.type == 'sound'">
              <audio 
                :src="message.body" 
                controls 
                preload="none"
                alt="Audio message from ">
              </audio>
            </div>
          </div>
          <!-- <div 
            v-for="i in 8"
            :key="i"  
            v-if="globalStore?.loading"
            :class="['message', i % 2 == 0 ? 'sent_msg' : 'recieved_msg']"
          >
            <div class="image" style="padding: 0;">
              <Skeleton width="100%" height="100%" />
            </div>
            <div class="text">
              <p>
                <Skeleton width="100%" height="20px" />
              </p>
              <p class="time">
                <Skeleton width="30px" height="20px" />
              </p>
            </div>
          </div> -->
          <div class="image empty_image" v-if="messages?.data?.length == 0">
            <img src="/assets/images/empty_box.png" alt="image" loading="lazy">
          </div>
        </div>
        <form action="" @submit.prevent="sendMessage"  v-if="globalStore?.roomId">
          <div class="input">
            <input 
              type="text"
              :placeholder="$t('chats.chats__input')"
              class="input_text"
              v-model="inputMessage"
              @keydown.enter="sendMessage"
            >
            <input 
              type="file" 
              ref="imageInput" 
              hidden 
              id="imageInput" 
              @change="uploadFile"
              accept="image/*"
            />
            <input 
              type="file" 
              ref="fileInput" 
              hidden 
              id="fileInput" 
              @change="uploadFile"
              accept=".pdf, "
            />
          </div>
          <div class="buttons">
            <button class="pi pi-send" @click="sendMessage"></button>
            <button @click="handleRecording">
              <i class="pi" :class="isRecording ? 'pi-stop' : 'pi-microphone'"></i>
            </button>
            <button class="pi pi-camera" @click="$refs.imageInput.click()"></button>
            <button class="pi pi-paperclip" @click="$refs.fileInput.click()"></button>
          </div>
        </form>
      </div>
    </div>
    <!-- <div class="chats_page" v-else>
      <div class="page empty-chat">
        <NotFoundEyes />
        <h3>{{$t('chats.empty_rooms')}}</h3>
      </div>
    </div> -->
    <audio ref="messageAudio" preload="auto" controls class="hidden">
      <source src="/assets/media/notification.mp3" type="audio/ogg">
      <source src="/assets/media/notification.mp3" type="audio/mpeg">
    </audio>
  </section>
</template>

<script setup>
  import { io } from 'socket.io-client';

  // define api methods
  const { 
    getMethod, 
    submitMethod,
    getResult,
    submitResult,
    showErrorToast
  } = useApiMethods()

  // intial states
  const messages = ref({ data: [] });
  const inputMessage = ref('');
  const socket = ref(null);
  const contentEl = ref(null); // Template ref for content div
  const showContacts = ref(true)
  const fileInput = ref(null);
  const imageInput = ref(null);
  const messageAudio = ref()
  const isRecording = ref(false);
  const mediaRecorder = ref(null);
  const audioChunks = ref([]);
  const newMsg = ref(null);



  // to check if there is any rooms for this user
  const isUserHasRooms = ref(true)

  // define route to get params of room
  const route = useRoute()

  // define global store 
  const globalStore = useGlobalStore()

  // define auth store
  const authStore = useAuth()

  // Computed for button style
  const buttonStyle = computed(() => ({
    transform: globalStore?.lang === 'en' ? 'rotate(40deg)' : 'rotate(225deg)'
  }));


  //#############################################################################################
  //##################################### Handle Send Message ###################################
  //#############################################################################################
  const sendMessage = () => {
    if (inputMessage.value.trim() || fileInput.value?.files?.length > 0 || imageInput.value?.files?.length > 0) {
      const message = {
        id: Date.now(),
        senderId: globalStore.user.id,
        // content: inputMessage.value || '',
        file: null,
        fileType: null,
        time: new Date().toLocaleTimeString(),
      };
      if (fileInput.value?.files?.length > 0) {
        const file = fileInput.value.files[0];
        if (file.type !== 'application/pdf') {
          showErrorToast( globalStore.lang == 'ar' ? 'الملف يجب ان يكون من نوع pdf' : 'The file must be a PDF type');
          return
        }
        const reader = new FileReader();

        reader.onload = (e) => {
          message.file = e.target.result; // Base64 encoded file
          message.fileType = file.type;
          socket.value.emit('send_message', message);
          // messages.value.push(message);
          // inputMessage.value = '';
          fileInput.value.value = ''; // Reset file input
        };
        reader.readAsDataURL(file);
        const fileData = new FormData()
        fileData.append('file' , file)
        submitMethod(`upload-room-file/${globalStore.roomId}` , true ,  fileData , 'POST' , '')
      }
      else if(imageInput.value?.files?.length > 0){
        const file = imageInput.value.files[0];
        const reader = new FileReader();
        if (!file.type.startsWith('image/')) {
          showErrorToast(globalStore.lang == 'ar' ? `يجب أن يكون الملف صورة من الأنواع التالية (png, jpeg, jpg)` : `The file must be an image from the following types (png, jpeg, jpg)`);
          return;
        }

        reader.onload = (e) => {
          message.file = e.target.result; // Base64 encoded file
          message.fileType = file.type;
          socket.value.emit('send_message', message);
          // messages?.value?.push(message);
          // inputMessage.value = '';
          imageInput.value.value = ''; // Reset file input
        };
        reader.readAsDataURL(file);
        const fileData = new FormData()
        fileData.append('file' , file)
        submitMethod(`upload-room-file/${globalStore.roomId}` , true ,  fileData , 'POST' , '')
        // console.log(file)
      }
      else {
        sendMessageTosocket('text' , inputMessage.value)
      }
    }
  };

  //######################################################################################
  // ############################## SOCKET SEND FUNCTION #################################
  //###################################################################################### 
  function sendMessageTosocket(newType, newResponse) {
    if (socket.value) {
      socket.value.emit("sendMessage", {
        receivers: getResult?.value?.receivers,
        receiver_type: 'User',
        room_id: globalStore.roomId,
        type: newType,
        body: newResponse,
      });
      // if(newType == 'text'){
      //   getMethod(`get-room-messages/${globalStore.roomId}`, null , true, false);
      // }
      inputMessage.value = ''
    }
  }


  // File upload handler
  const uploadFile = () => {
    sendMessage();
  };

  // handle scroll to bottom 
  const handleScrollToBottom = () => {
    if (contentEl.value) {
      setTimeout(() => {
        contentEl.value.scrollTo({
          top: contentEl.value.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  }

  //#############################################################################################
  //################## Helper function to determine file type from extension ####################
  //#############################################################################################
  function determineFileType(fileName) {
    const extension = fileName?.split('.').pop()?.toLowerCase();

    // Map of known extensions to message types
    const fileTypeMap = {
      // Image types
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',

      // Audio types
      mp3: 'sound',
      wav: 'sound',
      m4a: 'sound',
      ogg: 'sound',
      webm: 'sound',

      // Video types
      mp4: 'video',
      avi: 'video',
      mov: 'video',

      // Document types
      pdf: 'file',
      doc: 'file',
      docx: 'file',
      xls: 'file',
      xlsx: 'file',

      // Invoice types (treated as documents)
      invoice: 'invoice', // Custom logic if you want to handle invoices separately

      // Default or unrecognized types
    };

    // Return the determined type or default to 'file'
    return fileTypeMap[extension] || 'file';
  }

  //###################################################################################### 
  //############################## Handle Recording ###################################### 
  //###################################################################################### 
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.value = new MediaRecorder(stream);
      audioChunks.value = [];

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data);
        }
      };

      mediaRecorder.value.onstop = async () => {
        const message = {
          id: Date.now(),
          senderId: globalStore.user.id,
          file: null,
          fileType: 'audio',
          time: new Date().toLocaleTimeString(),
        };

        const audioBlob = new Blob(audioChunks.value, { type: 'audio/m4a' });
        
        // First approach: Try to get duration using AudioContext (more reliable)
        let duration = await getAudioDuration(audioBlob);
        
        // Fallback if AudioContext method fails
        if (!duration || duration === Infinity) {
          duration = await getDurationFromAudioElement(audioBlob);
        }
        
        // Final fallback - estimate based on file size
        if (!duration || duration === Infinity) {
          duration = estimateDuration(audioBlob);
        }

        const formData = new FormData();
        formData.append("file", audioBlob, `audio-${Date.now()}.m4a`);
        formData.append("duration", duration);

        const reader = new FileReader();
        reader.onload = (e) => {
          message.file = e.target.result;
          message.duration = duration; // Add duration to message
          socket.value.emit('send_message', message);
          submitMethod(`upload-room-file/${globalStore.roomId}`, true, formData, 'POST', '');
          audioChunks.value = [];
        };
        reader.readAsDataURL(audioBlob);
      };

      // getMethod(`get-room-messages/${globalStore.roomId}`, null, true, false);
      mediaRecorder.value.start();
      isRecording.value = true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      isRecording.value = false;
    }
  };

  // Helper function to get duration using AudioContext (more reliable)
  async function getAudioDuration(blob) {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const fileReader = new FileReader();
      
      fileReader.onload = function(e) {
        audioContext.decodeAudioData(e.target.result, function(buffer) {
          resolve(buffer.duration);
        }, () => resolve(null)); // On error, return null
      };
      
      fileReader.readAsArrayBuffer(blob);
    });
  }

  // Helper function to get duration from audio element (less reliable)
  async function getDurationFromAudioElement(blob) {
    return new Promise((resolve) => {
      const audioElement = new Audio(URL.createObjectURL(blob));
      audioElement.onloadedmetadata = () => {
        // Sometimes duration is still Infinity even after metadata loaded
        if (audioElement.duration !== Infinity) {
          resolve(audioElement.duration);
        } else {
          resolve(null);
        }
      };
      audioElement.onerror = () => resolve(null);
      // Set timeout in case events don't fire
      setTimeout(() => resolve(null), 1000);
    });
  }

  // Helper function to estimate duration based on file size
  function estimateDuration(blob) {
    // Rough estimation for m4a: filesize / (bitrate / 8)
    // Using average bitrate of 64 kbps (64000 bits/sec)
    const bytesPerSecond = 64000 / 8;
    return Math.round((blob.size / bytesPerSecond) * 10) / 10;
  }

  // Stop recording
  const stopRecording = () => {
    mediaRecorder.value.stop();
    isRecording.value = false;
    // if (mediaRecorder.value && isRecording.value) {
    //   mediaRecorder.value = false;
      audioChunks.value = [];
    // }
  };

  const handleRecording = () => {
    if(isRecording.value){
      stopRecording()
    }else{
      startRecording()
    }
  }


  //######################################################################################
  //###################### Watch Result Of Fetching Messages #############################
  //###################################################################################### 
  watchEffect(() => {
    if (getResult?.value) {
      messages.value = getResult?.value?.messages || { data: [] }
      handleScrollToBottom();
      // to refetch the contacts when recieve new msg to show the last message
      // newMsg.value = true
    }
  })



  // watch for changes in globalStore.roomId to enter the chat room
  watch(() => globalStore.roomId, (newRoomId) => {
    if (newRoomId) {
      socket.value.emit("enterChat", {
        room_id: newRoomId,
      });
      getMethod(`get-room-messages/${newRoomId}`, null, true, false);
    }
  });

  //#############################################################################################
  //###################### Watch Result Of posting to send it to the socket #####################
  //#############################################################################################
  watch(() => submitResult?.value?.data, (newValue) => {
    if (newValue) {
      // console.log(newValue?.data);

      // Determine file type from the file extension
      const fileName = newValue?.data?.file_name;
      const fileType = determineFileType(fileName);

      // console.log(fileName , fileType)
      // Send the message with the appropriate type
      sendMessageTosocket(fileType, fileName);
      if(messageAudio.value){
        messageAudio.value.play()
      }

      // Optionally fetch room messages (only if necessary)
      // getMethod(`get-room-messages/${globalStore.roomId}`, null , true , false);
    }
  });

  //###################################################################################### 
  //########################### HANDLE ENTER CHAT ROOM ################################### 
  //###################################################################################### 
  const handleEnterRoom = (roomId) => {
    if(roomId){
      globalStore.roomId = roomId
      getMethod(`get-room-messages/${roomId}` , null , true , false)
      showContacts.value = false
    }else{
      getMethod('get-rooms', null , true, false);
    }
  }





  //###################################################################################### 
  //############################## Socket Connection ##################################### 
  //###################################################################################### 
  if (import.meta.prerender) {
    // Mock data for prerendering
    messages.value = { data: [
      { id: 1, body: "Sample message 1", created_dt: "2025-01-01" },
      { id: 2, body: "Sample message 2", created_dt: "2025-01-02" }
    ] };
  } else {
    // Client-side only code
    onMounted(() => {
      // Initialize socket
      socket.value = io("https://backend.co-research.sa:4852/", {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
        query: {
          sender_id: globalStore.user.id,
          sender_type: 'User',
          sender_name: globalStore.user.name,
          avatar: globalStore.user.image,
          lang: globalStore?.lang || 'ar',
        },
      });

      // Socket listeners
      socket.value.on('sendMessageRes', function (data) {
        if (messages.value?.data) {
          setTimeout(() => {
            if (!messages.value.data.some((msg) => msg.id === data.id)) {
              messages.value.data.unshift(data);
              // console.log('New message received:', data);
              newMsg.value = data;
              handleScrollToBottom();
            }
          }, 500);
        }
      });


      // Fetch messages and enter chat
      if(globalStore.roomId){
        getMethod(`get-room-messages/${globalStore.roomId}`, null , true, false);
      }
      socket.value.emit("enterChat", {
        room_id: globalStore.roomId,
      });


      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      navigator.permissions.query({ name: "microphone" }).then((result) => {
        if (result.state === "granted") {
          console.log("Microphone permission is granted ✅");
        } else {
          showErrorToast(globalStore.lang == 'ar' ? 'يجب السماح بالوصول إلى الميكروفون لتسجيل الصوت' : 'You must allow access to the microphone to record audio');
        }
      });

      handleScrollToBottom();
    });

    onUnmounted(() => {
      if (socket.value) {
        socket.value.disconnect();
        globalStore.roomId = ''
      }
    });
  }
</script>

<style lang="scss" scoped>
  .chats_page{
    @include displayFlex($align : stretch , $gap : 10px);
    border-radius: 12px;
    box-shadow: 0px 4px 4px 0px #0000000D;
    // height: 70vh;
    position: relative;
    .chat_room{
      // height: 100vh;
      box-shadow: 2px 0px 4px 0px #00000040;
      border-radius: 12px;
      overflow: hidden;
      width: 100%;
      // position: relative;
      .messages{
        height: 64.3vh;
        overflow-y: scroll;
        background: #ECECEC80;
        padding: 15px 8px 20px;
        .message{
          @include displayFlex($justify : flex-start , $align : flex-end , $gap : 5px);
          position: relative;
          max-width: 600px;
          .image{
            @include circle(40px);
            flex-shrink: 0;
            border: 1px solid #e4e4e4;
            // padding: 3px 3px 0;
          }
          .message_image{
            width: 300px;
            height: 160px;
            border-radius: 5px !important;
            img{
              object-fit: cover !important;
            }
          }
          .pdf_file{
            width: 80px;
            height: 80px;
            border-radius: 0;
            border: none;
            padding: 0;
            img{
              object-fit: contain;
            }
          }
          .text{
            flex-grow: 1;
            position: relative;
            height: fit-content;
            min-height: 50px;
            background: #fff;
            padding: 5px 8px;
            > p{
              font-size: 14px;
              font-weight: 400;
              color: $mainColor;
              margin-bottom: 15px;
              max-width: 200px;
            }
            .time{
              position: absolute;
              bottom: 2px;
              inset-inline-end: 10px;
              font-size: 12px;
              font-weight: 300;
              margin-bottom: 0 !important;
            }
          }
          &.recieved_msg{
            .text{
              border-radius: 10px 10px 0 10px;
              background: #6F6F6F !important;
              color: #fff;
              p{
                color: #fff;
              }
            }
          }
          &.sent_msg{
            flex-direction: row-reverse;
            margin-inline-start: auto;
            .text{
              background: #fff;
              border-radius: 10px 10px 10px 0;
            }
          }
          &:not(:last-of-type){
            margin-bottom: 15px;
          }
        }
      }
      form , 
      .form{
        @include displayFlex($gap : 10px);
        width: 100%;
        padding: 5px 8px;
        background: #ECECEC;
        .input{
          flex-grow: 1;
          border: none;
          background: #fff;
        }
        .buttons{
          @include displayFlex($gap : 8px);
          button.pi{
            font-size: 16px;
          }
        }
      }
    }
    .empty-chat{
      .image{
        width: 200px;
      }
    }
  }
  .empty_image{
    max-width: 300px;
    margin:100px auto;
  }
  .page_header{
    @include displayFlex($justify : space-between);
    margin-bottom: 30px;
    h3{
      margin-bottom: 0;
    }
  }
  audio{
    width: 300px;
    border: 1px solid rgba($mainColor , 0.2);
    border-radius: 8px;
    input , button{
      color: #fff !important;
      outline: none !important;
    }
  }
  audio::-webkit-media-controls-enclosure{
    background: transparent;
  }

  .float_btn{
    width: 40px;
    height: 40px;
    margin: 0;
    display:none;
    @media(max-width:767px){
      display:flex;
    }
  }
  .eyes-container{
    height: 150px;
  }
</style>