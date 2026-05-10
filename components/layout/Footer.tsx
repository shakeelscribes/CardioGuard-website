// components/layout/Footer.tsx
import Link from 'next/link';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-on-surface dark:bg-dark-background border-t border-white/10 py-12">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-jakarta font-bold text-lg text-white">CardioGuard</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              AI-powered cardiovascular disease risk prediction platform. Know your heart health before it's too late.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Twitter, href: '#' },
                { Icon: Github, href: 'https://github.com/shakeelscribes/cardioguard-website.git' },
                { Icon: Linkedin, href: '#' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href}
                  target={href !== '#' ? "_blank" : undefined}
                  rel={href !== '#' ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2">
              {['Dashboard', 'Predict', 'History', 'Statistics', 'Profile'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-white/50 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Notice'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2026 CardioGuard. Not a substitute for professional medical advice.
          </p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for better heart health worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
