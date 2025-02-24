import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LibraryStats from "@/components/LibraryStats";

export default function Home() {

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="h-screen w-full ">
      <div className="h-24 bg-slate-100 px-10 flex items-center justify-between">
        <div className="flex flex-col">
          <div>
            <p className="text-2xl">Books Due Today</p>
          </div>

          <div>
              <p>{today}</p>
          </div>
        </div>

        <div className="flex justify-between items-center ">
          {/* <div >
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
          </div> */}

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
