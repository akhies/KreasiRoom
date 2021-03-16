<template>
  <section class="py-5 mx-auto" style="max-width: 960px">
    <h1 class="text-center text-uppercase mb-5">Buat Room</h1>
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
      <b-form-group
        label="Nama Room (Nama Event) *"
        :state="!$v.form.roomName.$error"
        invalid-feedback="Wajib mengisi nama room"
      >
        <b-form-input
          v-model="$v.form.roomName.$model"
          @blur="updateRoomCode"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Lokasi *"
        :state="!$v.form.locationName.$error"
        invalid-feedback="Wajib mengisi lokasi kegiatan"
      >
        <b-form-input v-model="$v.form.locationName.$model"></b-form-input>
      </b-form-group>
      <b-form-row>
        <b-col sm="6">
          <b-form-group
            label="Check-in *"
            :state="!$v.form.checkIn.$error"
            invalid-feedback="Wajib mengisi jadwal check in"
          >
            <date-picker
              v-model="$v.form.checkIn.$model"
              type="datetime"
              :show-second="false"
              :disabled-date="disableDateAfterCheckOut"
              :disabled-time="disableTimeAfterCheckOut"
            >
              <template #icon-calendar>
                <fa-icon :icon="faCalendarAlt" class="text-white"></fa-icon>
              </template>
            </date-picker>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="Check-out *"
            :state="!$v.form.checkOut.$error"
            invalid-feedback="Wajib mengisi jadwal check out"
          >
            <date-picker
              v-model="$v.form.checkOut.$model"
              type="datetime"
              :show-second="false"
              :disabled-date="disableDateBeforeCheckIn"
              :disabled-time="disableTimeBeforeCheckIn"
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
        <b-form-input
          v-model="form.password"
          type="password"
          autocomplete="new-password"
        ></b-form-input>
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
        ></b-form-file>
      </b-form-group>
      <div class="text-right">
        <b-button variant="danger" to="/rooms" class="mr-2">Batal</b-button>
        <b-button type="submit" variant="primary" :disabled="isCreating"
          >Buat Room</b-button
        >
      </div>
    </b-form>
  </section>
</template>

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
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import {
  addRoom,
  addRoomDetail,
  addRoomPassword,
  validateActiveRoomCode
} from '@/api/rooms';
import globalToast from '@/helpers/global-toast';
import slugify from '@/helpers/slugify';
import getFileExtension from '@/helpers/file-extension';

export default {
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
      form: {
        roomName: '',
        roomCode: '',
        locationName: '',
        checkIn: null,
        checkOut: null,
        videoCallUrl: '',
        youtubeLiveUrl: '',
        facebookLiveUrl: '',
        password: '',
        description: '',
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
      isCreating: false,
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
    today() {
      return new Date();
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
  methods: {
    disableDateAfterCheckOut(date) {
      if (!this.form.checkOut) return false;
      const checkOut = new Date(this.form.checkOut);
      checkOut.setHours(0, 0, 0, 0);
      return date > checkOut;
    },
    disableTimeAfterCheckOut(date) {
      return this.form.checkOut ? date >= this.form.checkOut : false;
    },
    disableDateBeforeCheckIn(date) {
      if (!this.form.checkIn) return date <= this.today;
      const checkIn = new Date(this.form.checkIn);
      checkIn.setHours(0, 0, 0, 0);
      return date < checkIn;
    },
    disableTimeBeforeCheckIn(date) {
      return this.form.checkIn ? date <= this.form.checkIn : date <= this.today;
    },
    updateRoomCode() {
      this.form.roomCode = slugify(this.form.roomName);
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
      if (this.$store.getters.isEmailExpired) {
        globalToast(
          this.$root.$bvToast,
          'Email Anda telah kadaluwarsa. Silakan verifikasi email Anda terlebih dahulu.',
          'error'
        );
        this.$router.push('/rooms');
        return;
      }
      try {
        this.isCreating = true;
        this.$v.$touch();
        if (this.$v.$invalid)
          throw new Error('Lengkapi formulir sebelum mengirim.');

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

        // run upload cover
        const coverImageUrl = this.form.cover
          ? await this.uploadCoverImage()
          : '';

        const currentUser = this.$store.getters.getUserInfo;
        const ref = await addRoom(this.$fireStore, {
          name: this.form.roomName,
          checkIn: this.form.checkIn,
          checkOut: this.form.checkOut,
          code: this.form.roomCode,
          hostId: currentUser.id,
          hostName: currentUser.name,
          locationName: this.form.locationName,
          isActive: true,
          isPublic: true,
          createdAt: this.$fireStoreObj.FieldValue.serverTimestamp(),
          attendantsCounter: 0,
          questionsCounter: 0,
          questionLimit: 10,
          hasPassword: !!this.form.password
        });

        await addRoomDetail(this.$fireStore, ref.id, {
          coverImageUrl,
          description: this.form.description,
          facebookLiveUrl: this.form.facebookLiveUrl,
          videoCallUrl: this.form.videoCallUrl,
          youtubeLiveUrl: this.form.youtubeLiveUrl
        });

        if (this.form.password) {
          await addRoomPassword(this.$fireStore, ref.id, {
            text: this.form.password
          });
        }

        globalToast(this.$root.$bvToast, 'Berhasil membuat room.', 'success');
        this.$store.commit('ADD_CREATED_ROOM', ref.id);
        this.$router.push(`/rooms/${this.form.roomCode}`);
      } catch (error) {
        console.error(error);
      } finally {
        this.isCreating = false;
      }
    }
  }
};
</script>
