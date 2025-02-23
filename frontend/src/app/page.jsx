import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LibraryStats from "@/components/LibraryStats";

export default function Home() {
  return (
    <div className="h-screen w-full ">
      <div className="h-24 bg-slate-100 px-10 flex items-center justify-between">
        <div className="flex flex-col">
          <div>
            <p className="text-2xl">Books Due Today</p>
          </div>

          <div>
              <p>Friday, February 21, 2025</p>
          </div>
        </div>

        <div className="flex justify-between items-center w-[600px]">
          <div >
            <Input type="email" id="email" placeholder="Email" />
          </div>          

          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <button className="p-2 w-40 border-2">Refresh</button>
          </div>

          <div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <LibraryStats/>
    </div>
  );
} 
