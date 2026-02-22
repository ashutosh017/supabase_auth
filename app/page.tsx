import { getAllBases } from "./actions/base";
import { SignInDialog } from "./components/signin-dialog";
import UploadBaseDialog from "./components/upload-base-dialog";
// import supabase from "./lib/supabase-client";
import { createClient } from "./lib/supabase_server_client";

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
      <div className="flex justify-between">
        <UploadBaseDialog />
        {session ? (
          <div className="flex gap-2 items-center justify-center">
            <div className="btn btn-primary text-xl font-bold">
              {session.user.email?.split("")[0]}
              {/* {session.user.user_metadata.name} */}
            </div>
            <button className="btn btn-secondary">Logout</button>
          </div>
        ) : (
          <SignInDialog />
        )}
      </div>
      <h2 className="text-2xl font-extrabold mt-2 lg:mt-4">Recently Added</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.success &&
          data.data.map((d) => (
            <BaseCard link={d.imgUrl} key={d.id} thLevel={d.thLevel} />
          ))}
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
        <BaseCard link="https://dropinblog.net/34253310/files/featured/imagem-2025-04-16-133753129.png" />
      </div>
    </div>
  );
}

export const BaseCard = ({
  thLevel,
  link,
}: {
  thLevel?: string | number;
  link: string;
}) => {
  return (
    // Replaced w-96 with w-full so the card conforms to the grid column size
    <div className="card bg-base-100 w-full shadow-sm border border-base-200">
      <figure>
        {/* Added w-full and object-cover to ensure the image scales nicely */}
        <img src={link} alt="coc base" className="w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Town Hall {thLevel ? thLevel : "13"}</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Copy Base</button>
        </div>
      </div>
    </div>
  );
};
