<template>
  <div class="py-4">
    <section class="mb-5">
      <b-row>
        <b-col md="8" lg="6">
          <b-form @submit.prevent="updateProfile">
            <div class="mb-4">
              <div class="d-flex align-items-end">
                <b-img
                  v-if="form.picture"
                  block
                  rounded="circle"
                  v-bind="pictureLayout"
                  class="mr-2"
                  :src="form.picture"
                ></b-img>
                <b-img
                  v-else
                  block
                  rounded="circle"
                  v-bind="pictureLayout"
                  class="mr-2"
                  src="@/assets/images/default-user.svg"
                ></b-img>
                <label class="mb-0 mr-2 text-underline">
                  edit
                  <input type="file" class="d-none" @change="readURL" />
                </label>
              </div>
            </div>
            <b-form-group
              :state="!$v.form.name.$error"
              invalid-feedback="Nama wajib diisi"
            >
              <template v-slot:label>Nama Lengkap *</template>
              <b-form-input v-model="$v.form.name.$model"></b-form-input>
            </b-form-group>
            <b-form-group
              :state="!$v.form.userId.$error"
              invalid-feedback="ID wajib diisi"
            >
              <template v-slot:label>ID *</template>
              <b-form-input v-model="$v.form.userId.$model"></b-form-input>
            </b-form-group>
            <template
              v-if="currentUser && currentUser.loginWith === 'password'"
            >
              <b-form-group
                label="Kata Sandi"
                :state="!$v.form.password.$error"
                invalid-feedback="Minimum 8 karakter"
              >
                <b-form-input
                  v-model="$v.form.password.$model"
                  type="password"
                  autocomplete="new-password"
                ></b-form-input>
              </b-form-group>
            </template>
            <b-form-group label="Nama Perusahaan/Organisasi">
              <b-form-input v-model="form.company"></b-form-input>
            </b-form-group>
            <b-form-group label="Jabatan">
              <b-form-input v-model="form.job"></b-form-input>
            </b-form-group>
            <template
              v-if="currentUser && currentUser.loginWith === 'password'"
            >
              <b-form-group :state="!$v.form.email.$error">
                <template v-slot:label>Alamat Email *</template>
                <b-form-input
                  v-model="$v.form.email.$model"
                  type="email"
                ></b-form-input>
                <div slot="invalid-feedback">
                  <div v-if="!$v.form.email.required">
                    Alamat email wajib diisi
                  </div>
                  <div v-if="!$v.form.email.email">
                    Format alamat email salah
                  </div>
                </div>
              </b-form-group>
            </template>
            <b-form-group
              :state="!$v.form.phoneNumber.$error"
              invalid-feedback="Nomor telepon wajib diisi"
            >
              <template v-slot:label>Nomor Telepon *</template>
              <b-form-input
                v-model="$v.form.phoneNumber.$model"
                type="tel"
              ></b-form-input>
            </b-form-group>
            <div
              v-if="currentUser && currentUser.loginWith !== 'password'"
              class="mb-4"
            >
              <p class="text-info">Login menggunakan</p>
              <fa-icon
                :icon="loginProviderIcon.icon"
                size="2x"
                :style="{ color: loginProviderIcon.color }"
              ></fa-icon>
              <span class="text-info">({{ currentUser.email }})</span>
            </div>
            <b-button variant="primary" type="submit" :disabled="isSaving">
              <span v-if="!isSaving">Simpan</span>
              <fa-icon v-else :icon="faSpinner" spin class="mr-2"></fa-icon>
            </b-button>
          </b-form>
        </b-col>
      </b-row>
    </section>
    <section class="mb-5">
      <h2 class="h3 mb-3 text-uppercase">Room yang Dibuat</h2>
      <loading-indicator v-if="isLoadingCreatedRooms" />
      <div class="text-center" v-if="isLoadingCreatedRoomsFailed">
        <p>Gagal mengambil data room.</p>
        <b-button variant="info" @click="loadCreatedRooms">Cari Ulang</b-button>
      </div>
      <template v-if="!isLoadingCreatedRooms && !isLoadingCreatedRoomsFailed">
        <p v-if="!createdRooms.length" class="text-center">
          Room tidak ditemukan.
        </p>
        <template v-else>
          <b-row>
            <b-col md="6" lg="4" v-for="room in createdRooms" :key="room.id">
              <room-block
                :room="room"
                :current-user="currentUser"
                :is-closed="room.isClosed"
                @enter="$router.push(`rooms/${room.code}`)"
              ></room-block>
            </b-col>
          </b-row>
          <div class="text-center">
            <b-button
              v-if="createdRoomsToLoad > 0"
              variant="primary"
              @click="loadCreatedRooms()"
              >Tarik Lagi</b-button
            >
          </div>
        </template>
      </template>
    </section>
    <section class="mb-5">
      <h2 class="h3 mb-3 text-uppercase">Room yang Dihadiri</h2>
      <loading-indicator v-if="isLoadingSavedRooms" />
      <div class="text-center" v-if="isLoadingSavedRoomsFailed">
        <p>Gagal mengambil data room.</p>
        <b-button variant="info" @click="loadSavedRooms">Cari Ulang</b-button>
      </div>
      <template v-if="!isLoadingSavedRooms && !isLoadingSavedRoomsFailed">
        <p v-if="!savedRooms.length" class="text-center">
          Room tidak ditemukan.
        </p>
        <template v-else>
          <b-row>
            <b-col md="6" lg="4" v-for="room in savedRooms" :key="room.id">
              <room-block
                :room="room"
                :current-user="currentUser"
                :is-closed="room.isClosed"
                @enter="$router.push(`rooms/${room.code}`)"
              ></room-block>
            </b-col>
          </b-row>
          <div class="text-center">
            <b-button
              v-if="savedRoomsToLoad > 0"
              variant="primary"
              @click="loadSavedRooms()"
              >Tarik Lagi</b-button
            >
          </div>
        </template>
      </template>
    </section>
    <b-button variant="danger" @click="logout"
      >Keluar dari Kreasi Room</b-button
    >
    <b-modal
      id="logout-required"
      centered
      hide-header
      ok-title="Keluar Sekarang"
      ok-variant="danger"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      cancel-title="Batal Keluar"
      @ok="logout"
      >Anda perlu melakukan login ulang untuk dapat melakukan
      perubahan.</b-modal
    >
  </div>
</template>

<script>
import {
  BCard,
  BForm,
  BFormInput,
  BInputGroup,
  BInputGroupAppend
} from 'bootstrap-vue';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { required, email, minLength } from 'vuelidate/lib/validators';
import {
  updateUserInfo,
  updateUserAuthProfile,
  updateAuthEmail,
  updateAuthPassword,
  checkId
} from '@/api/users';
import { fetchRoomsByIds } from '@/api/rooms';
import globalToast from '@/helpers/global-toast';
import slugify from '@/helpers/slugify';
import getFileExtension from '@/helpers/file-extension';

export default {
  components: {
    BCard,
    BForm,
    BFormInput,
    BInputGroup,
    BInputGroupAppend
  },
  data() {
    return {
      form: {
        name: '',
        userId: '',
        password: '',
        company: '',
        job: '',
        email: '',
        phoneNumber: '',
        picture: '',
        newPicture: null
      },
      history: {
        name: '',
        email: ''
      },
      pictureLayout: {
        width: 120,
        height: 120
      },
      isSaving: false,
      createdRooms: [],
      isLoadingCreatedRooms: false,
      isLoadingCreatedRoomsFailed: false,
      savedRooms: [],
      isLoadingSavedRooms: false,
      isLoadingSavedRoomsFailed: false,
      isUploadingProfilePicture: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    faSpinner() {
      return faSpinner;
    },
    providerStyle() {
      return {
        'google.com': {
          icon: faGoogle,
          color: '#db3236'
        },
        'facebook.com': {
          icon: faFacebook,
          color: '#3b5998'
        }
      };
    },
    loginProviderIcon() {
      if (!this.currentUser) return;
      return this.providerStyle[this.currentUser.loginWith];
    },
    createdRoomIds() {
      return this.$store.getters['createdRooms'];
    },
    createdRoomsLoaded() {
      return this.createdRooms.length;
    },
    createdRoomsToLoad() {
      const diff = this.createdRoomIds.length - this.createdRoomsLoaded;
      return diff > 10 ? 10 : diff;
    },
    savedRoomIds() {
      return this.$store.getters['savedRooms'];
    },
    savedRoomsLoaded() {
      return this.savedRooms.length;
    },
    savedRoomsToLoad() {
      const diff = this.savedRoomIds.length - this.savedRoomsLoaded;
      return diff > 10 ? 10 : diff;
    }
  },
  validations: {
    form: {
      name: {
        required
      },
      userId: {
        required
      },
      email: {
        required,
        email
      },
      phoneNumber: {
        required
      },
      password: {
        minLength: function() {
          if (this.form.password === '') {
            return true;
          }
          return minLength(8);
        }
      }
    }
  },
  async mounted() {
    const currentUser = this.$store.getters['getUserInfo'];
    if (!currentUser) return;
    this.form.name = currentUser.name;
    this.form.email = currentUser.email;
    this.form.userId = currentUser.userId;
    this.form.picture = currentUser.picture;
    this.form.company = currentUser.company || '';
    this.form.job = currentUser.job || '';
    this.form.phoneNumber = currentUser.phoneNumber || '';
    this.history.name = currentUser.name;
    this.history.email = currentUser.email;
    await Promise.all([this.loadCreatedRooms(), this.loadSavedRooms()]);
  },
  methods: {
    readURL(event) {
      this.form.newPicture = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.form.picture = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]); // convert to base64 string
    },
    showLogoutRequest() {
      this.$bvModal.show('logout-required');
    },
    async uploadProfilePicture() {
      try {
        const BYTES_TO_MEGABYTES = 1 / 1000000;
        if (this.form.newPicture.size * BYTES_TO_MEGABYTES > 2)
          throw new Error('Ukuran file melebihi 2 MB');
        const storageRef = this.$fireStorage.ref();
        const fileExtension = getFileExtension(this.form.newPicture.name);
        const nameSlug = slugify(`${this.form.name} ${this.currentUser.id}`);
        const coverImageRef = storageRef.child(
          `profile/${nameSlug}.${fileExtension}`
        );
        const snap = await coverImageRef.put(this.form.newPicture);
        const pictureUrl = await snap.ref.getDownloadURL();
        return pictureUrl;
      } catch (error) {
        console.error(error);
      }
    },
    async updateProfile() {
      this.$v.form.$touch();
      if (this.$v.form.$invalid) return;
      this.isSaving = true;
      try {
        const isIdExists = await checkId(
          this.$fireStore,
          this.form.userId,
          this.currentUser.id
        );
        if (isIdExists) throw new Error('ID telah terdaftar');

        const userInfoPayload = {
          name: this.form.name,
          userId: this.form.userId,
          company: this.form.company,
          job: this.form.job,
          email: this.form.email,
          phoneNumber: this.form.phoneNumber
        };

        if (this.form.password) {
          await updateAuthPassword(this.$fireAuth, this.form.password);
          this.form.password = '';
        }

        if (this.history.email !== this.form.email) {
          await updateAuthEmail(this.$fireAuth, this.form.email);
          this.history.email = this.form.email;
          this.$store.commit('SET_CURRENT_USER_EMAIL', this.form.email);
        }

        const pictureUrl = this.form.newPicture
          ? await this.uploadProfilePicture()
          : null;
        if (pictureUrl) {
          userInfoPayload.picture = pictureUrl;
        }
        if (this.history.name !== this.form.name || pictureUrl) {
          await updateUserAuthProfile(this.$fireAuth, {
            name: this.form.name,
            picture: pictureUrl
          });
          this.history.name = this.form.name;
          this.$store.commit('SET_CURRENT_USER_NAME', this.form.name);

          this.form.picture = pictureUrl || '';
          this.form.newPicture = null;
          this.$store.commit('SET_CURRENT_USER_PICTURE', pictureUrl);
        }

        await updateUserInfo(
          this.$fireStore,
          this.currentUser.id,
          userInfoPayload
        );

        this.$store.commit('SET_CURRENT_USER_PROFILE', {
          userId: this.form.userId,
          company: this.form.company,
          job: this.form.job,
          phoneNumber: this.form.phoneNumber
        });

        globalToast(this.$bvToast, 'Berhasil mengubah profil.', 'success');
      } catch (error) {
        console.error('page update profile error: ', error);
        globalToast(
          this.$bvToast,
          error.message || 'Berhasil mengubah profil.',
          'error'
        );
        if (error.code === 'auth/requires-recent-login') {
          this.showLogoutRequest();
          return;
        }
      } finally {
        this.isSaving = false;
      }
    },
    async loadCreatedRooms() {
      try {
        this.isLoadingCreatedRooms = true;
        this.isLoadingCreatedRoomsFailed = false;
        const createdRooms = this.createdRoomIds.slice(
          this.createdRoomsLoaded,
          this.createdRoomsToLoad + this.createdRoomsLoaded
        );
        const rooms = await fetchRoomsByIds(
          this.$fireStore,
          this.$fireStoreObj,
          createdRooms
        );
        this.createdRooms.push(...rooms);
      } catch (error) {
        this.isLoadingCreatedRoomsFailed = true;
      } finally {
        this.isLoadingCreatedRooms = false;
      }
    },
    async loadSavedRooms() {
      try {
        this.isLoadingSavedRooms = true;
        this.isLoadingSavedRoomsFailed = false;
        const savedRooms = this.savedRoomIds.slice(
          this.savedRoomsLoaded,
          this.savedRoomsToLoad + this.savedRoomsLoaded
        );
        const rooms = await fetchRoomsByIds(
          this.$fireStore,
          this.$fireStoreObj,
          savedRooms
        );
        this.savedRooms.push(...rooms);
      } catch (error) {
        this.isLoadingSavedRoomsFailed = true;
      } finally {
        this.isLoadingSavedRooms = false;
      }
    },
    async logout(event) {
      event.preventDefault();
      this.$router.push({
        path: '/logout'
      });
    }
  }
};
</script>
