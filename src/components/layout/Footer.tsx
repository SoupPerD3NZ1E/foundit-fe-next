import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f7f7f7] pt-16 pb-8 pl-16 pr-16">
      <div className="mx-auto w-full px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-[22px] font-extrabold text-[#0f5138]">
              FOUND IT
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-gray-500">
              FoundIt is a premier freelance marketplace where clients can hire
              verified professionals for web development, design, writing, and
              digital services securely.
            </p>
            <div className="flex items-center gap-4 mt-6 text-gray-500">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-gray-700" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">MARKETPLACE</h4>
            <ul className="mt-4 space-y-3 text-gray-500 text-[15px]">
              <li className="hover:text-gray-700 cursor-pointer">Find Freelancers</li>
              <li className="hover:text-gray-700 cursor-pointer">Post a Project</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">COMPANY</h4>
            <ul className="mt-4 space-y-3 text-gray-500 text-[15px]">
              <li className="hover:text-gray-700 cursor-pointer">About Us</li>
              <li className="hover:text-gray-700 cursor-pointer">Careers</li>
              <li className="hover:text-gray-700 cursor-pointer">Contact Support</li>
              <li className="hover:text-gray-700 cursor-pointer">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">LEGAL</h4>
            <ul className="mt-4 space-y-3 text-gray-500 text-[15px]">
              <li className="hover:text-gray-700 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-gray-700 cursor-pointer">Terms of Service</li>
              <li className="hover:text-gray-700 cursor-pointer">Intellectual Property Claims</li>
              <li className="hover:text-gray-700 cursor-pointer">Secure Payment Info</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 FoundIt Marketplace. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>English (US)</span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
