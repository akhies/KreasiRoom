<template>
  <section class="py-5">
    <h1 class="text-center text-uppercase mb-5">Edit Room</h1>
    <b-form @submit.prevent="createRoom" @reset.prevent="resetCreateRoom">
      <b-form-group
        label="Kode Room *"
        :state="!$v.form.roomCode.$error && !isCodeStillActive"
      >
        <b-form-input v-model="$v.form.roomCode.$model"></b-form-input>
        <div slot="invalid-feedback">
          <div v-if="!$v.form.roomCode.required">Wajib mengisi kode room</div>
          <div v-if="isCodeStillActive">
            Kode tidak dapat digunakan. Ubah kode room terlebih dahulu.
          </div>
        </div>
      </b-form-group>
      <b-form-group label="Nama Room (Nama Event) *">
        <b-form-input v-model="form.roomName" disabled></b-form-input>
      </b-form-group>
      <b-form-group label="Lokasi *">
        <b-form-input v-model="form.locationName" disabled></b-form-input>
      </b-form-group>
      <b-form-row>
        <b-col sm="6">
          <b-form-group label="Check-in *">
            <date-picker
              v-model="form.checkIn"
              type="datetime"
              :show-second="false"
              disabled
            >
              <template #icon-calendar>
                <fa-icon :icon="faCalendarAlt" class="text-white"></fa-icon>
              </template>
            </date-picker>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Check-out *">
            <date-picker
              v-model="form.checkOut"
              type="datetime"
              :show-second="false"
              disabled
            >
              <template #icon-calendar>
                <fa-icon :icon="faCalendarAlt" class="text-white"></fa-icon>
              </template>
            </date-picker>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-group
        label="Link aplikasi Video Call (Zoom, Skype, Google Meet, dll)"
        :state="!$v.form.videoCallUrl.$error"
        invalid-feedback="Wajib diisi dalam format link"
      >
        <b-form-input v-model="$v.form.videoCallUrl.$model"></b-form-input>
      </b-form-group>
      <b-form-group
        label="Link Youtube Live"
        :state="!$v.form.youtubeLiveUrl.$error"
        invalid-feedback="Wajib diisi dalam format link"
        description="Sertakan http:// atau https://, contoh: https://www.youtube.com/watch?v=abc1234"
      >
        <b-form-input v-model="$v.form.youtubeLiveUrl.$model"></b-form-input>
      </b-form-group>
      <b-form-group
        label="Link Facebook/Instagram Live"
        :state="!$v.form.facebookLiveUrl.$error"
        invalid-feedback="Wajib diisi dalam format link"
        description="Sertakan http:// atau https://"
      >
        <b-form-input v-model="$v.form.facebookLiveUrl.$model"></b-form-input>
      </b-form-group>
      <b-form-group label="Password">
        <b-form-input v-model="form.password"></b-form-input>
      </b-form-group>
      <b-form-group label="Tentang Room">
        <div class="editor">
          <editor-menu-bubble
            v-slot="{ commands, isActive, menu }"
            :editor="editor"
            keep-in-bounds
          >
            <div
              class="menububble"
              :class="{ 'is-active': menu.isActive }"
              :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
            >
              <b-button
                :variant="isActive.bold() ? 'primary' : 'light'"
                size="sm"
                class="mr-2"
                @click="commands.bold"
              >
                <fa-icon :icon="faBold"></fa-icon>
              </b-button>
              <b-button
                :variant="isActive.italic() ? 'primary' : 'light'"
                size="sm"
                class="mr-2"
                @click="commands.italic"
              >
                <fa-icon :icon="faItalic"></fa-icon>
              </b-button>
              <b-button
                :variant="isActive.underline() ? 'primary' : 'light'"
                size="sm"
                class="mr-2"
                @click="commands.underline"
              >
                <fa-icon :icon="faUnderline"></fa-icon>
              </b-button>
              <b-button
                :variant="isActive.bullet_list() ? 'primary' : 'light'"
                size="sm"
                class="mr-2"
                @click="commands.bullet_list"
              >
                <fa-icon :icon="faListUl"></fa-icon>
              </b-button>
              <b-button
                :variant="isActive.ordered_list() ? 'primary' : 'light'"
                size="sm"
                @click="commands.ordered_list"
              >
                <fa-icon :icon="faListOl"></fa-icon>
              </b-button>
            </div>
          </editor-menu-bubble>
          <editor-content
            :editor="editor"
            class="form-control form-editor"
          ></editor-content>
        </div>
      </b-form-group>
      <b-form-group label="Unggah Gambar (Maks. 2MB)">
        <b-form-file
          v-model="form.cover"
          plain
          accept="image/jpeg, image/png"
          class="mb-3"
        ></b-form-file>
        <b-img
          v-if="form.coverImage"
          :src="form.coverImage"
          fluid-grow
          class="mb-3"
          style="max-width: 30rem"
        ></b-img>
      </b-form-group>
      <div class="text-right">
        <b-button variant="danger" :to="`/rooms/${roomCode}`" class="mr-2"
          >Batal</b-button
        >
        <b-button type="submit" variant="primary" :disabled="isUpdating"
          >Edit Room</b-button
        >
      </div>
    </b-form>
  </section>
</template>

<script>
import { required, url } from 'vuelidate/lib/validators';
import { BForm, BFormInput, BFormFile } from 'bootstrap-vue';
import DatePicker from 'vue2-datepicker';
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap';
import {
  Bold,
  Italic,
  Underline,
  ListItem,
  BulletList,
  OrderedList
} from 'tiptap-extensions';
import { faBold } from '@fortawesome/free-solid-svg-icons/faBold';
import { faItalic } from '@fortawesome/free-solid-svg-icons/faItalic';
import { faUnderline } from '@fortawesome/free-solid-svg-icons/faUnderline';
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl';
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import {
  editRoom,
  editRoomDetail,
  editRoomPassword,
  validateActiveRoomCode,
  fetchRoomInfoByCode,
  fetchRoomDetail,
  fetchRoomPassword
} from '@/api/rooms';
import globalToast from '@/helpers/global-toast';
import slugify from '@/helpers/slugify';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import getFileExtension from '@/helpers/file-extension';

export default {
  layout: 'room',
  async validate({ $fireStore, params }) {
    return await validateActiveRoomCode($fireStore, params.code);
  },
  components: {
    DatePicker,
    BForm,
    BFormInput,
    BFormFile,
    EditorContent,
    EditorMenuBubble
  },
  data() {
    return {
      id: '',
      form: {
        roomName: '',
        roomCode: '',
        prevRoomCode: '',
        locationName: '',
        checkIn: null,
        checkOut: null,
        videoCallUrl: '',
        youtubeLiveUrl: '',
        facebookLiveUrl: '',
        password: '',
        description: '',
        coverImage: '',
        cover: null
      },
      editor: new Editor({
        extensions: [
          new Bold(),
          new Italic(),
          new Underline(),
          new ListItem(),
          new BulletList(),
          new OrderedList()
        ],
        content: ``,
        onUpdate: ({ getHTML }) => {
          this.form.description = getHTML();
        }
      }),
      isUpdating: false,
      isCodeStillActive: false
    };
  },
  validations: {
    form: {
      roomName: {
        required
      },
      roomCode: {
        required
      },
      locationName: {
        required
      },
      checkIn: {
        required
      },
      checkOut: {
        required
      },
      videoCallUrl: {
        url
      },
      youtubeLiveUrl: {
        url
      },
      facebookLiveUrl: {
        url
      }
    }
  },
  computed: {
    roomCode() {
      return this.$route.params.code;
    },
    faBold() {
      return faBold;
    },
    faItalic() {
      return faItalic;
    },
    faUnderline() {
      return faUnderline;
    },
    faListUl() {
      return faListUl;
    },
    faListOl() {
      return faListOl;
    },
    faCalendarAlt() {
      return faCalendarAlt;
    }
  },
  async mounted() {
    await this.fetchRoomInfo();
  },
  methods: {
    updateRoomCode() {
      this.form.roomCode = slugify(this.form.roomName);
    },
    async fetchRoomInfo() {
      try {
        const room = await fetchRoomInfoByCode(this.$fireStore, this.roomCode);
        if (room.hostId !== this.$store.getters['getUserInfo'].id) {
          globalToast(
            this.$root.$bvToast,
            'Anda tidak dapat mengakses halaman ini.',
            'error'
          );
          this.$router.push('/rooms');
        }
        this.id = room.id;
        this.form.roomName = room.name;
        this.form.prevRoomCode = room.code;
        this.form.roomCode = room.code;
        this.form.locationName = room.locationName;
        this.form.checkIn = room.checkInJSDatetime;
        this.form.checkOut = room.checkOutJSDatetime;
        const roomDetail = await fetchRoomDetail(this.$fireStore, this.id);
        this.form.videoCallUrl = roomDetail.videoCallUrl || '';
        this.form.youtubeLiveUrl = roomDetail.youtubeLiveUrl || '';
        this.form.facebookLiveUrl = roomDetail.facebookLiveUrl || '';
        this.form.description = roomDetail.description || '';
        this.editor.setContent(roomDetail.description || '');
        this.form.coverImage = roomDetail.coverImageUrl;
        const password = await fetchRoomPassword(this.$fireStore, this.id);
        this.form.password = password.text;
      } catch (error) {
        console.error(error);
      }
    },
    async uploadCoverImage() {
      try {
        const BYTES_TO_MEGABYTES = 1 / 1000000;
        if (this.form.cover.size * BYTES_TO_MEGABYTES > 2)
          throw new Error('Ukuran file melebihi 2 MB');
        this.isUploadCoverImageFailed = false;
        const storageRef = this.$fireStorage.ref();
        const fileExtension = getFileExtension(this.form.cover.name);
        const coverImageRef = storageRef.child(
          `rooms/${this.form.roomCode}/${this.form.roomCode}-cover.${fileExtension}`
        );
        const snap = await coverImageRef.put(this.form.cover);
        return await snap.ref.getDownloadURL();
      } catch (error) {
        throw error;
      }
    },
    async createRoom() {
      if (this.$store.getters['isEmailExpired']) {
        globalToast(
          this.$root.$bvToast,
          'Email Anda telah kadaluawa. Silakan verifikasi email Anda terlebih dahulu.',
          'error'
        );
        this.$router.push('/rooms');
      }
      try {
        this.isUpdating = true;
        this.$v.$touch();
        if (this.$v.$invalid)
          throw new Error('Lengkapi formulir sebelum mengirim.');

        if (this.form.prevRoomCode !== this.form.roomCode) {
          const isCodeStillActive = await validateActiveRoomCode(
            this.$fireStore,
            this.form.roomCode
          );
          if (isCodeStillActive) {
            this.isCodeStillActive = true;
            throw new Error(
              'Kode tidak dapat digunakan. Ubah kode room terlebih dahulu.'
            );
          }
        }

        const coverImageUrl = this.form.cover
          ? await this.uploadCoverImage()
          : '';

        const editRoomDetailPayload = {
          facebookLiveUrl: this.form.facebookLiveUrl,
          videoCallUrl: this.form.videoCallUrl,
          youtubeLiveUrl: this.form.youtubeLiveUrl,
          description: this.form.description
        };

        if (coverImageUrl) {
          editRoomDetailPayload.coverImageUrl = coverImageUrl;
        }

        const currentUser = this.$store.getters.getUserInfo;
        await editRoom(this.$fireStore, this.id, {
          code: this.form.roomCode
        });

        await editRoomDetail(this.$fireStore, this.id, editRoomDetailPayload);

        if (this.form.password) {
          await editRoomPassword(this.$fireStore, ref.id, {
            text: this.form.password
          });
        }

        globalToast(this.$root.$bvToast, 'Berhasil mengubah room.', 'success');
        this.$router.push(`/rooms/${this.form.roomCode}`);
      } catch (error) {
        console.error(error);
      } finally {
        this.isUpdating = false;
      }
    }
  }
};
</script>

<style lang="scss">
.form {
  &-editor {
    height: auto;
    .ProseMirror:focus {
      outline: none;
    }
  }
}

.editor {
  position: relative;
}

.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: #fff;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity 0.2s, visibility 0.2s;
  transition: opacity 0.2s, visibility 0.2s;
  &.is-active {
    opacity: 1;
    visibility: visible;
  }
}
</style>
