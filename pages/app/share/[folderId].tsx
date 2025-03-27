import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Adjust the path as necessary

interface Folder {
  id: string;
  name: string;
  slug: string;
  links: Array<{
    url: string;
    title: string;
    image: string;
  }>;
}

const ShareFolder = ({ folderId }: { folderId: string }) => {
  const [folder, setFolder] = useState<Folder | null>(null);

  useEffect(() => {
    const folderRef = doc(db, `sharedFolders/${folderId}`);

    getDoc(folderRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const folderData = snapshot.data();

          // Convert links object to array
          const linksArray = folderData.links
            ? Object.values(folderData.links)
            : [];

          setFolder({
            ...folderData,
            // @ts-expect-error - links is not typed
            links: linksArray, // Save links as an array
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [folderId]);

  if (!folder) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{folder.name}</h1>
      <ul>
        {folder?.links &&
          folder.links.map((link, index) => (
            <li key={index}>
              {/* @ts-expect-error - links is not typed */}
              <a href={link.ogUrl}>{link.ogUrl}</a>
            </li>
          ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps(context: {
  params: { folderId: string };
}) {
  const { folderId } = context.params;

  return {
    props: {
      folderId,
    },
  };
}

export default ShareFolder;
