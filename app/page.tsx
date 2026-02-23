import { getAllBases } from "./actions/base";
import { SignInDialog } from "./components/signin-dialog";
import UploadBaseDialog from "./components/upload-base-dialog";
// import supabase from "./lib/supabase-client";
import { createClient } from "./lib/supabase_server_client";
import { signOut } from "./actions/auth";

export default async function Home() {
  const supabase = await createClient();
  const data = await getAllBases();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log("session: ", session);

  return (
    <div className="container mx-auto min-h-screen pt-6 px-4 w-full">
      <div className="flex justify-between items-center mb-8">
        {session ? (
          <div className="flex gap-4 items-center">
            <UploadBaseDialog />
            <div className="flex gap-2 items-center justify-center">
              <div className="coc-panel px-4 py-2 font-bold text-[#4A3B2A]">
                {session.user.email?.split("")[0].toUpperCase()}
              </div>
              <form action={signOut}>
                <button type="submit" className="coc-btn coc-btn-grey">Logout</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex justify-between w-full items-center">
            <h1 className="text-3xl font-luckiest text-white drop-shadow-lg">CoC Base Share</h1>
            <SignInDialog />
          </div>
        )}
      </div>
      <h2 className="text-4xl text-white drop-shadow-md mb-6 text-center uppercase tracking-wider font-luckiest">Recently Added</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {data.success && data.data.length > 0 ? (
          data.data.map((d) => (
            <BaseCard link={d.imgUrl} key={d.id} thLevel={d.thLevel} baseLink={d.link} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-2xl font-luckiest text-stone-400">No bases found. Be the first to upload!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const BaseCard = ({
  thLevel,
  link,
  baseLink,
}: {
  thLevel?: string | number;
  link: string;
  baseLink?: string;
}) => {
  return (
    <div className="card coc-panel w-full transform hover:-translate-y-1 transition-transform duration-200 overflow-hidden">
      <figure className="border-b-4 border-[#4A3B2A] relative">
        <img src={link || "https://placehold.co/600x400?text=No+Preview"} alt="coc base" className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-coc-orange border-2 border-white px-2 py-1 rounded font-luckiest text-white text-sm shadow-md">
          TH {thLevel || "13"}
        </div>
      </figure>
      <div className="card-body p-4 bg-[#E6E1D6]">
        <h2 className="card-title text-2xl text-[#4A3B2A] font-luckiest uppercase">Town Hall {thLevel || "13"}</h2>
        <p className="text-[#5c4d3c] font-medium">
          Defend your village with this layout!
        </p>
        <div className="card-actions justify-end mt-2">
          {baseLink ? (
            <a 
              href={baseLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="coc-btn w-full text-center block no-underline"
            >
              Copy Base
            </a>
          ) : (
            <button className="coc-btn w-full opacity-50 cursor-not-allowed">No Link</button>
          )}
        </div>
      </div>
    </div>
  );
};
