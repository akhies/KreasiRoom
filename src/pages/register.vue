<template>
  <div>
    <section class="py-5">
      <b-form @submit.prevent="register" class="mb-4" style="max-width: 30rem">
        <b-form-group
          label="Nama lengkap"
          :state="!$v.form.fullName.$error"
          invalid-feedback="Nama lengkap wajib diisi"
        >
          <b-form-input
            id="full-name"
            size="lg"
            v-model="$v.form.fullName.$model"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Email"
          :state="!$v.form.email.$error"
        >
          <b-form-input
            type="email"
            id="email-address"
            size="lg"
            v-model="$v.form.email.$model"
          ></b-form-input>
          <div slot="invalid-feedback">
            <div v-if="!$v.form.email.required">
              Email wajib diisi
            </div>
            <div v-if="!$v.form.email.email">
              Format email tidak sesuai
            </div>
          </div>
        </b-form-group>
        <b-form-group
          label="Kata Sandi"
          :state="!$v.form.password.$error"
          description="Minimal 8 karakter"
        >
          <b-form-input
            type="password"
            id="password"
            size="lg"
            v-model="$v.form.password.$model"
          ></b-form-input>
          <div slot="invalid-feedback">
            <div v-if="!$v.form.password.required">
              Kata sandi wajib diisi
            </div>
            <div v-if="!$v.form.password.minLength">
              Butuh minimal 8 karakter
            </div>
          </div>
        </b-form-group>
        <p>
          Dengan menjadi pengguna Kreasi Room, berarti Anda setuju dengan
          <a
            href="#"
            @click.prevent="$bvModal.show('modal-tou')"
            class="font-weight-bold"
            >Ketentuan Penggunaan</a
          >
          dan
          <a
            href="#"
            @click.prevent="$bvModal.show('modal-privacy')"
            class=" font-weight-bold"
            >Kebijakan Privasi</a
          > yang telah diatur.
        </p>
        <b-button
          block
          size="lg"
          variant="dark"
          class="mb-4"
          type="submit"
          :disabled="isRegistering"
          >Daftar Sekarang</b-button
        >
        <p>Sudah punya akun?</p>
        <b-button
        block
          to="/login"
          size="lg"
          variant="dark"
          :disabled="isRegistering"
          >Masuk</b-button
        >
      </b-form>
    </section>
    <b-modal id="modal-tou" title="Terms of Use" ok-only>
      <h2>Kreasi Anak Muda Terms of Service</h2>
      <p>1. Terms<br>By accessing the website at
            <a href="https://kreasiroom.com">https://kreasiroom.com</a>, you are
            agreeing to be bound by these terms of service, all applicable laws
            and regulations, and agree that you are responsible for compliance
            with any applicable local laws. If you do not agree with any of
            these terms, you are prohibited from using or accessing this site.
            The materials contained in this website are protected by applicable
            copyright and trademark law.</p>
      <p>2. Use License<br>Permission is granted to temporarily download one copy of the
            materials (information or software) on Kreasi Anak Muda's website
            for personal, non-commercial transitory viewing only. This is the
            grant of a license, not a transfer of title, and under this license
            you may not:<ul>
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose, or for any public
              display (commercial or non-commercial);
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained on
              Kreasi Anak Muda's website;
            </li>
            <li>
              remove any copyright or other proprietary notations from the
              materials; or transfer the materials to another person or "mirror"
              the materials on any other server.
            </li>
          </ul>This license shall automatically terminate if you violate any of
            these restrictions and may be terminated by Kreasi Anak Muda at any
            time. Upon terminating your viewing of these materials or upon the
            termination of this license, you must destroy any downloaded
            materials in your possession whether in electronic or printed
            format.</p>
            <p>3. Disclaimer<br>The materials on Kreasi Anak Muda's website are provided on an 'as
            is' basis. Kreasi Anak Muda makes no warranties, expressed or
            implied, and hereby disclaims and negates all other warranties
            including, without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights.<br><br>Further, Kreasi Anak Muda does not warrant or make any
            representations concerning the accuracy, likely results, or
            reliability of the use of the materials on its website or otherwise
            relating to such materials or on any sites linked to this site.</p>
            <p>4. Limitations<br>In no event shall Kreasi Anak Muda or its suppliers be liable for
            any damages (including, without limitation, damages for loss of data
            or profit, or due to business interruption) arising out of the use
            or inability to use the materials on Kreasi Anak Muda's website,
            even if Kreasi Anak Muda or a Kreasi Anak Muda authorized
            representative has been notified orally or in writing of the
            possibility of such damage. Because some jurisdictions do not allow
            limitations on implied warranties, or limitations of liability for
            consequential or incidental damages, these limitations may not apply
            to you.</p>
            <p>5. Accuracy of materials<br>The materials appearing on Kreasi Anak Muda's website could include
            technical, typographical, or photographic errors. Kreasi Anak Muda
            does not warrant that any of the materials on its website are
            accurate, complete or current. Kreasi Anak Muda may make changes to
            the materials contained on its website at any time without notice.
            However Kreasi Anak Muda does not make any commitment to update the
            materials.</p>
            <p>6. Links<br>Kreasi Anak Muda has not reviewed all of the sites linked to its
            website and is not responsible for the contents of any such linked
            site. The inclusion of any link does not imply endorsement by Kreasi
            Anak Muda of the site. Use of any such linked website is at the
            user's own risk.</p>
            <p>7. Modifications<br>Kreasi Anak Muda may revise these terms of service for its website
            at any time without notice. By using this website you are agreeing
            to be bound by the then current version of these terms of service.</p>
            <p>8. Governing Law<br>These terms and conditions are governed by and construed in
            accordance with the laws of Indonesia and you irrevocably submit to
            the exclusive jurisdiction of the courts in that State or location.</p>
    </b-modal>
    <b-modal id="modal-privacy" title="Privacy Policy" ok-only>
      Privacy policy
    </b-modal>
  </div>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators';
import { BForm, BFormInput, BFormCheckbox } from 'bootstrap-vue';
import { addNewUser } from '@/api/users';
import { sendEmailVerification } from '@/helpers/send-email';
import globalToast from '@/helpers/global-toast.js';

export default {
  layout: 'auth',
  components: {
    BForm,
    BFormInput,
    BFormCheckbox
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        fullName: ''
      },
      isRegistering: false
    };
  },
  validations: {
    form: {
      fullName: {
        required
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  methods: {
    async register() {
      try {
        this.isRegistering = true;
        this.$v.$touch();
        if (this.$v.$invalid)
          throw new Error('Complete the form before submit');

        const userCredential = await this.$fireAuth.createUserWithEmailAndPassword(
          this.form.email,
          this.form.password
        );

        await sendEmailVerification(userCredential.user, process.env.BASE_URL);
        await addNewUser(this.$fireStore, {
          userId: userCredential.user.uid,
          userInfo: {
            name: this.form.fullName,
            email: userCredential.user.email,
            picture: '',
            phoneNumber: '',
            loginWith: userCredential.additionalUserInfo.providerId,
            registeredAt: this.$fireStoreObj.FieldValue.serverTimestamp(),
            emailUpdatedAt: this.$fireStoreObj.FieldValue.serverTimestamp()
          }
        });
        globalToast(
          this.$root.$bvToast,
          'Successfully registered an account. Please check your inbox or spam to verify your email address.',
          'success'
        );
        this.redirectAfterRegister();
      } catch (error) {
        console.error(error);
        this.isRegistering = false;
      }
    },
    redirectAfterRegister() {
      this.$router.push('/rooms');
    }
  }
};
</script>
