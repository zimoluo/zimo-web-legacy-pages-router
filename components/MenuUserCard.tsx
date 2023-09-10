import { imageFallback } from "@/lib/util";
import Image from "next/image";
import { useUser } from "./contexts/UserContext";
import { ThemeType, svgFilterMap } from "@/interfaces/themeMaps";
import { clearSessionToken } from "@/lib/accountManager";

const userIconMap: { [key: string]: string } = {
  admin: "/admin.svg",
  banned: "/banned.svg",
};

interface Props {
  theme: ThemeType;
}

const MenuUserCard: React.FC<Props> = ({ theme }) => {
  const { user, setUser } = useUser();
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];

  async function logOut(): Promise<void> {
    await clearSessionToken();
    setUser(null);
  }

  return (
    user !== null && (
      <div className="flex items-center w-full">
        <Image
          src={user.profilePic}
          className="h-12 md:h-16 w-auto aspect-square object-contain rounded-full"
          height={64}
          width={64}
          alt={`${user.name}'s Profile Picture`}
          onError={imageFallback('/favicon.svg')}
        />
        <div className="text-xl md:text-2xl font-bold ml-4">{user.name}</div>

        {user.state !== "normal" && (
          <Image
            src={userIconMap[user.state]}
            className="ml-1.5 h-4 md:h-5 w-auto aspect-square object-contain"
            height={20}
            width={20}
            alt={`User is ${user.state}`}
          />
        )}

        <div className="flex-grow" />
        <button className="ml-2 mr-2">
          <Image
            src="/logout.svg"
            className={`h-6 w-auto aspect-square object-contain ${svgFilterClass} transform transition-transform duration-300 hover:scale-125`}
            height={24}
            width={24}
            alt="Logout Button"
            onClick={logOut}
          />
        </button>
      </div>
    )
  );
};

export default MenuUserCard;
