import { Link } from "react-router-dom"


export const Logo = () => {
  return (
    <Link to={{ pathname: "/", search: "" }} className="hover:bg-muted/40 h-10 px-2 rounded-lg flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg" />
        </div>
        <span className="text-lg font-medium tracking-tight">Watermelon</span>
      </div>
    </Link>
  )
}
