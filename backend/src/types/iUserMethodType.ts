export interface IUserMethods {
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
}
