import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function Unauthorised() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-24 w-24 text-yellow-500 mb-8" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! It seems you don't have permission to access this page.
        </p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
            Return to Home
          </Button>
        </Link>
      </div>
      <footer className="mt-16 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  )
}