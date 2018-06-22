export default interface User {
    rg: string;
    displayName: string = '';
    email: string;
    phoneNumber: string;
    uid: string;
    emailVerified: boolean = false;
    photoUrl: string = '';
    picture: string;
}
