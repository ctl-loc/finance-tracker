import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "../ui/tabs";
import SignInForm from "./SigninForm";
import SignUpForm from "./SignupForm";

export default function SignInComponent() {
  return (
    <Tabs
      defaultValue="signin"
      className="min-h-1/3 w-1/3 flex justify-around text-gray-200"
    >
      <TabsList className="bg-gray-500 p-1 rounded-lg flex flex-row justify-around">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <SignInForm />
      </TabsContent>
      <TabsContent value="signup">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  );
}
