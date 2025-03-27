import {Geist, Geist_Mono, Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prudentis AI",
  description: "The Smart Money Manager",
};

export default function RootLayout({ children }) {
  return (
     <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className}`}>
      <Header/>

       <main className="min-h-screen"> {children} </main>
      <Toaster richColors/>
      <footer className="bg-black/80 backdrop-blur-md z-1 py-12">
          <div className="container mx-auto px-4 text-center text-white ">
              Made with ❤️ by Prudentis AI Team
          </div>
      </footer>



      </body>
    </html>
     </ClerkProvider>
  );
}
