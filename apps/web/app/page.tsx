import { Calendar } from "@repo/ui/calendar";
import "@repo/ui/calendar.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Calendar 
        className="dark:bg-gray-800" 
        style={{ minWidth: 800 }}
        
        // onChange={(date) => console.log(date)}
      >
        
      </Calendar>
    </div>
  );
}
