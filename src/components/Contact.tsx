"use client";

import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Navbar } from "@/components/Navbar";
import { FadeInSection } from "@/components/FadeInSection";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { HeaderText } from "@/components/HeaderText";
import { FloatingActions } from "@/components/FloatingActions";
import { GoogleMap } from "@/components/GoogleMap";
import { ContactForm } from "@/components/ContactForm";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="relative">
      <WelcomeBanner />

      {/* Sticky Navbar */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      <div className="bg-dark">
        <div className="max-w-7xl mx-auto bg-white pb-20">
          {/* Hero Section */}
          <FadeInSection delay={0.2}>
            <PageHero
              title="Contact Us @ Air Training Command"
              description="Reach out to us through any of the official communication channels below."
              callToAction="Get in Touch"
            />
          </FadeInSection>

          {/* Address Section */}
          <div className="mt-10">
            <HeaderText title="Headquarters Address" />
            <FadeInSection>
              <motion.p
                className="text-gray-800 leading-9 px-10 lg:px-20 indent-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                PMB 4512, Mando, Kaduna, Nigeria.
              </motion.p>
            </FadeInSection>
          </div>

          {/* Contact Channels */}
          <div className="mt-16">
            <HeaderText title="Contact Information" />

            <div className="px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
              {/* Phone */}
              <FadeInSection delay={0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="p-6 shadow rounded-xl border bg-gray-50"
                >
                  <h3 className="font-bold text-lg text-primary">Phone</h3>
                  <p className="mt-2 text-gray-700 leading-7">
                    +234 (0) 000 0000 000
                    <br />
                    +234 (0) 111 1111 111
                  </p>
                </motion.div>
              </FadeInSection>

              {/* Email */}
              <FadeInSection delay={0.2}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="p-6 shadow rounded-xl border bg-gray-50"
                >
                  <h3 className="font-bold text-lg text-primary">Email</h3>
                  <p className="mt-2 text-gray-700 leading-7">
                    info@airtrainingcommand.mil.ng
                    <br />
                    support@airtrainingcommand.mil.ng
                  </p>
                </motion.div>
              </FadeInSection>

              {/* Office Hours */}
              <FadeInSection delay={0.3}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="p-6 shadow rounded-xl border bg-gray-50"
                >
                  <h3 className="font-bold text-lg text-primary">
                    Office Hours
                  </h3>
                  <p className="mt-2 text-gray-700 leading-7">
                    Mon – Fri: 8:00am – 4:00pm
                    <br />
                    Sat – Sun: Closed
                  </p>
                </motion.div>
              </FadeInSection>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-20">
            <HeaderText title="Send Us a Message" />

            <ContactForm />
          </div>

          {/* Google Map */}
          <div className="mt-20 px-10 lg:px-20">
            <HeaderText title="Location on Map" />
            <FadeInSection>
              <GoogleMap />
            </FadeInSection>
          </div>
        </div>
        <FloatingActions />

        <Footer />
      </div>
    </div>
  );
}
