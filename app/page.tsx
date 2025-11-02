import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Target, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) return redirect("/dashboard");

  return (
    <main className='min-h-screen bg-linea-to-b from-blue-50 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-foreground transition-colors'>
      {/* Navigation */}
      <nav className='flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-white/70 dark:bg-gray-900/50 border-b border-border sticky top-0 z-50'>
        <div className='text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight'>
          <div className='flex items-center gap-2'>
            <div className='w-32 h-14 relative'>
              <Image
                src={"/mainlogo.png"}
                alt='StatusUp Logo'
                fill
                className='object-contain'
                sizes='130px'
                priority
              />
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Link
            href='/login'
            className='text-foreground/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'
          >
            Log in
          </Link>
          <Link href='/signup'>
            <Button className='bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-all shadow-sm'>
              Sign up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='px-6 md:px-12 py-20 md:py-32 text-center relative'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight'>
            Organize your job search like never before
          </h1>
          <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto'>
            Track applications, manage interviews, and land your dream job with
            our intuitive Kanban board designed for job seekers.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/signup'>
              <Button
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 gap-2 text-white font-semibold shadow-md'
              >
                Get started free <ArrowRight className='w-4 h-4' />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/50'>
            {[
              ["10K+", "Job seekers using JobTracker"],
              ["85%", "Report increased offers"],
              ["2.5K", "Jobs tracked daily"],
            ].map(([value, label], i) => (
              <div key={i} className='text-center'>
                <div className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                  {value}
                </div>
                <p className='text-gray-600 dark:text-gray-400'>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='px-6 md:px-12 py-20 bg-white/70 dark:bg-gray-900/40 backdrop-blur-md border-t border-b border-border'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-bold text-center mb-16 text-gray-900 dark:text-gray-100'>
            Everything you need to succeed
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                Icon: BarChart3,
                title: "Kanban Board",
                desc: "Visualize your job applications across different stages with an intuitive drag-and-drop board.",
              },
              {
                Icon: Target,
                title: "Track Details",
                desc: "Store company info, job titles, priority levels, and application dates all in one place.",
              },
              {
                Icon: Zap,
                title: "Quick Actions",
                desc: "Add, update, or remove job applications with just a few clicks.",
              },
              {
                Icon: CheckCircle,
                title: "Stay Organized",
                desc: "Never miss an opportunity to follow up on applications again.",
              },
            ].map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className='p-6 rounded-2xl bg-background dark:bg-gray-950 border border-border/60 shadow-sm hover:shadow-md transition-all'
              >
                <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4'>
                  <Icon className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>
                  {title}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='px-6 md:px-12 py-20'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-4xl font-bold text-center mb-16 text-gray-900 dark:text-gray-100'>
            How it works
          </h2>

          {[
            [
              "1",
              "Create your account",
              "Sign up in seconds and start tracking your job search immediately.",
            ],
            [
              "2",
              "Add your applications",
              "Enter company name, position, priority, and application date for each job.",
            ],
            [
              "3",
              "Organize with Kanban",
              "Drag cards between columns as your applications progress.",
            ],
            [
              "4",
              "Land your dream job",
              "Stay focused and organized until you accept that perfect offer.",
            ],
          ].map(([num, title, desc], i) => (
            <div key={i} className='flex gap-6 mb-8'>
              <div className='shrink-0'>
                <div className='w-10 h-10 rounded-full bg-blue-600 text-white dark:bg-blue-500 flex items-center justify-center font-bold'>
                  {num}
                </div>
              </div>
              <div>
                <h3 className='text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100'>
                  {title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='px-6 md:px-12 py-20 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white text-center'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 leading-tight'>
            Ready to organize your job search?
          </h2>
          <p className='text-lg mb-8 opacity-90'>
            Join thousands of job seekers already using JobTracker to land their
            dream jobs.
          </p>
          <Link href='/register'>
            <Button
              size='lg'
              variant='secondary'
              className='gap-2 bg-white text-blue-700 hover:bg-blue-100 font-semibold'
            >
              Get started free <ArrowRight className='w-4 h-4' />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='px-6 md:px-12 py-12 border-t border-border bg-white/70 dark:bg-gray-900/40 backdrop-blur-md'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-10'>
            {[
              {
                title: "JobTracker",
                items: ["Organize your job search and land your dream job."],
              },
              {
                title: "Product",
                items: ["Features", "Pricing", "FAQ"],
              },
              {
                title: "Company",
                items: ["About", "Blog", "Contact"],
              },
              {
                title: "Legal",
                items: ["Privacy", "Terms", "Cookies"],
              },
            ].map(({ title, items }, i) => (
              <div key={i}>
                <h4 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                  {title}
                </h4>
                <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                  {items.map((item, j) => (
                    <li key={j}>
                      <a
                        href='#'
                        className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className='border-t border-border pt-8 text-center text-sm text-gray-600 dark:text-gray-400'>
            © {new Date().getFullYear()} StatusUp. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
