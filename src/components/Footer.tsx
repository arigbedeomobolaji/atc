import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NAFLogo from "../assets/NAF_logo.png";

export function Footer() {
  return (
    <div className="bg-blue-950/95 text-white border-b-8 border-b-yellow-300 pb-4">
      <div className=" flex items-center justify-around p-3 lg:px-5 shadow-md hover:shadow-lg">
        {/* Social Media Icons */}
        <div className="flex flex-col">
          <h1 className="font-heading font-bold leading-8">Our Social links</h1>
          <div className="flex flex-col gap-3 items-center">
            <div className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all duration-300">
              <Facebook className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300" />{" "}
              Facebook
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all duration-300">
              <Instagram className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300" />{" "}
              Instagram
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all duration-300">
              <Youtube className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300" />{" "}
              Youtube
            </div>
          </div>
        </div>

        {/* Our Links */}
        <div className="flex flex-col">
          <h1 className="font-heading font-bold leading-8">Our links</h1>
          <div className="leading-7 flex flex-col">
            {["About", "History", "News & Event", "Contact Us"].map(
              (item, index) => (
                <Link
                  key={index}
                  href="/"
                  className="hover:-translate-y-1 transition-all duration-300"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Relevant Links */}
        {/* Social Media Icons */}
        <div className="flex flex-col">
          <h1 className="font-heading font-bold leading-8">Relevant Links</h1>
          <div className="flex flex-col gap-3 items-center">
            <div className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:translate-y-1 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <Image
                src={NAFLogo}
                alt="NAF"
                width={25}
                height={25}
                priority
                style={{ width: "auto", height: "auto" }}
              />
              <Link href="https://www.airforce.mil.ng/" className="font-link">
                NAF Website
              </Link>
            </div>
          </div>
        </div>
      </div>
      <h1 className="flex items-center justify-center">
        Developed by 441 CIS Group, Kaduna &copy;2025
      </h1>
    </div>
  );
}
