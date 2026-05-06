import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle,
  Mail,
  User,
  Phone,
  MessageSquare,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { useClientConfig } from "@/lib/client-config";

const JoinUs = () => {
  const { config } = useClientConfig();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // EmailJS service configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Validate environment variables
      if (!serviceId || !templateId || !publicKey) {
        const missingVars = [];
        if (!serviceId) missingVars.push("VITE_EMAILJS_SERVICE_ID");
        if (!templateId) missingVars.push("VITE_EMAILJS_TEMPLATE_ID");
        if (!publicKey) missingVars.push("VITE_EMAILJS_PUBLIC_KEY");

        throw new Error(
          `EmailJS configuration is missing. Please set these environment variables: ${missingVars.join(
            ", "
          )}. See EMAILJS_SETUP.md for instructions.`
        );
      }

      // Email template parameters - using standard EmailJS variable names
      const templateParams = {
        to_email: "logicsync4518@gmail.com",
        user_name: `${formData.firstName} ${formData.lastName}`,
        user_email: formData.email,
        user_phone: formData.phone,
        user_message: formData.message || "No message provided",
        subject: `New Join Us Form Submission from ${formData.firstName} ${formData.lastName}`,
        // Additional formatted message for email body
        message: `
New Join Us Form Submission

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Message: ${formData.message || "No message provided"}

Submitted on: ${new Date().toLocaleString()}
        `.trim(),
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log("Email sent successfully:", response);

      // Success - show success message
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("Email sending failed:", err);

      // Extract detailed error message
      let errorMessage =
        "Failed to submit your application. Please try again or contact us directly.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        const errorObj = err as {
          text?: string;
          message?: string;
          status?: number;
        };
        if (errorObj.text) {
          errorMessage = `Error: ${errorObj.text}. Please check your EmailJS configuration.`;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.status) {
          errorMessage = `Error ${errorObj.status}: ${
            errorObj.text ||
            "Invalid request. Please check your EmailJS service ID, template ID, and template variables."
          }`;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground flex flex-col lg:flex-row min-h-screen relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-4 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Left Side - Video Section */}
      <div className="w-1/2 relative hidden lg:flex items-center justify-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover object-top"
          style={{ objectPosition: "center 25%" }}
          src="/media/join-vid.mp4"
          autoPlay
          loop
          muted
        />
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          className="absolute bottom-10 left-10 text-foreground bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-border max-w-sm"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h2
            className="text-4xl font-bold mb-3"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Let's Create Together
          </motion.h2>
          <p className="text-muted-foreground leading-relaxed">
            Tell us about your project and let's bring your vision to life
            with cinematic storytelling and visual excellence.
          </p>
          <motion.div
            className="mt-4 flex items-center gap-2 text-primary"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Ready to start your project?</span>
            <ArrowRight size={20} />
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex items-center justify-center relative z-10 pt-20 lg:pt-16">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-sm font-bold text-primary mb-2 uppercase">{config.name}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              Get In Touch
            </h1>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-start gap-3"
            >
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center p-12 bg-gradient-to-br from-primary/10 to-pink-400/10 rounded-2xl backdrop-blur-md border border-primary/30"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle
                  size={80}
                  className="mx-auto text-primary mb-4"
                />
              </motion.div>
              <h3 className="text-3xl font-bold mt-4 text-foreground mb-2">
                Thank you!
              </h3>
              <p className="text-muted-foreground mb-2">
                Your inquiry has been received.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll review your project details and get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    First name*
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3 text-muted-foreground z-10"
                    />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Last name*
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3 text-muted-foreground z-10"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email address*
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-3 text-muted-foreground z-10"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Phone Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone number*
                </label>
                <div className="relative flex">
                  <Phone
                    size={18}
                    className="absolute left-3 top-3 text-muted-foreground z-10"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 0000000000"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Message Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Tell us about your project
                </label>
                <div className="relative">
                  <MessageSquare
                    size={18}
                    className="absolute left-3 top-3 text-muted-foreground z-10"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your project, timeline, budget..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Footer Text */}
              <motion.p
                variants={itemVariants}
                className="text-xs text-muted-foreground text-center"
              >
                We respect your privacy. Your information will be kept
                confidential.
              </motion.p>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JoinUs;
