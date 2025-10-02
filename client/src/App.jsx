import { Button } from "./components/ui/button"
import { ArrowRight, Check, Code } from "lucide-react"
import "./App.css";

export default function HackerTemplateSuccess() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="container mx-auto pt-8 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-black dark:text-white" />
            <span className="font-bold text-xl">HackerTemplate</span>
          </div>
          <a
            href="https://hackertemplate.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1">
              Documentation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full mb-6">
            <Check className="h-5 w-5" />
            <span className="font-medium">Successfully Initialized</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-black dark:text-white">
            Your project is ready to go!
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            HackerTemplate has set up your Vite project with Tailwind CSS and shadcn/ui components. Start building your amazing application right away.
          </p>

          <Button className="h-12 px-8 text-base gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Start Coding
            <Code className="h-5 w-5" />
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black dark:text-white text-sm font-medium">1</span>
              </div>
              <div>
                <p className="font-medium">Explore your project structure</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Get familiar with the files and folders in your new project.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black dark:text-white text-sm font-medium">2</span>
              </div>
              <div>
                <p className="font-medium">Modify this page</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Edit <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">app/page.jsx</code> to start building your application.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black dark:text-white text-sm font-medium">3</span>
              </div>
              <div>
                <p className="font-medium">Add more components</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Install additional shadcn/ui components as needed.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-auto">
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Created with HackerTemplate CLI — The modern way to initialize frontend projects</p>
        </div>
      </footer>
    </div>
  )
}