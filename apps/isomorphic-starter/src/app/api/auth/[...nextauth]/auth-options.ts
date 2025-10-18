import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import isEqual from 'lodash/isEqual';
import { pagesOptions } from './pages-options';

export const authOptions: NextAuthOptions = {
  // debug: true,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 saat JWT token için
    updateAge: 0, // Her istekte session güncelleme
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Tarayıcı kapanınca silinsin diye expires ayarlama
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.idToken as string,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        // return user as JWT
        token.user = user;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Çıkış yapılıyorsa direkt /giris'e yönlendir
      if (url.includes('/api/auth/signout') || url === '/giris') {
        return `${baseUrl}/giris`;
      }
      
      // Eğer NEXTAUTH_URL tanımlıysa onu kullan, yoksa baseUrl kullan
      const redirectBase = process.env.NEXTAUTH_URL || baseUrl;
      
      // Eğer url relative bir path ise, redirectBase ile birleştir
      if (url.startsWith('/')) {
        return `${redirectBase}${url}`;
      }
      
      // Eğer url tam bir URL ise ve aynı origin'de ise, direkt döndür
      if (url.startsWith(redirectBase)) {
        return url;
      }
      
      // Aksi halde redirectBase'i döndür
      return redirectBase;
    },
  },
  events: {
    async signOut() {
      // Çıkış yapıldığında ekstra temizlik işlemleri
      console.log('Kullanıcı çıkış yaptı');
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          
          // API'ye login isteği gönder
          const response = await fetch(`${API_URL}/kullanicilar/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              kullanici_adi: credentials?.email,
              sifre: credentials?.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: `${user.ad} ${user.soyad}`,
              kullanici_adi: user.kullanici_adi,
            };
          }
          
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
