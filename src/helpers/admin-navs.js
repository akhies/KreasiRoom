const ADMIN_URL = '/admin';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons/faDoorOpen';
import { faBookmark } from '@fortawesome/free-solid-svg-icons/faBookmark';

export default [
  {
    text: 'Dashboard',
    link: ADMIN_URL,
    icon: faHome
  },
  {
    text: 'Rooms',
    link: ADMIN_URL + '/rooms',
    icon: faDoorOpen
  }
  // {
  //   text: 'Bookings',
  //   link: ADMIN_URL + '/bookings',
  //   icon: faBookmark
  // }
];
