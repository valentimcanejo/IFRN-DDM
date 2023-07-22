import db, { storage } from "@/firebase/initFirebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { NextResponse } from "next/server";

interface ResponseStructure {
  data: any;
  statusCode: number;
  status: string;
  message: string;
}

export async function GET(request: Request, response: Response) {
  try {
    const collectionRef = collection(db, "items");
    const collectionDocs = await getDocs(collectionRef);
    const collectionData = collectionDocs.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return NextResponse.json({
      data: collectionData,
      statusCode: 200,
      status: "OK",
      message: "Itens retornados",
    });
  } catch (error: any) {
    return new Response(null, { status: 500 });
  }
}

// Your imports here...

export async function POST(request: Request, response: Response) {
  try {
    const collectionRef = collection(db, "items");

    const requestBody = await request.json();
    const { name, description, imageUrl, idNum } = requestBody; // Extracting "name" and "imageUrl" from the request body

    if (!name || !imageUrl) {
      return new Response("Os dados fornecidos são incompletos.", {
        status: 400,
      });
    }
    const idDoc = await addDoc(collectionRef, { name, description, idNum });

    // Upload the image to Firebase Storage
    const imageBuffer = Buffer.from(imageUrl, "base64");

    const imageRef = ref(storage, `${idDoc.id}`);

    await uploadString(imageRef, imageUrl, "base64", {
      contentType: "image/png",
    });

    console.log(idDoc);
    const downloadURL = await getDownloadURL(imageRef);

    console.log("Image URL:", downloadURL);
    const itemRef = doc(db, "items", idDoc.id);
    await updateDoc(itemRef, {
      imageUrl: downloadURL,
    });
    // Save the item data to Firestore

    return NextResponse.json({
      data: { name },
      statusCode: 200,
      status: "OK",
      message: "Item adicionado",
    });
  } catch (error: any) {
    console.log(error);

    return new Response(null, { status: 500 });
  }
}

export async function PUT(request: Request, response: Response) {
  try {
    const requestBody = await request.json();

    if (!requestBody.id) {
      return new Response("ID do item não foi fornecido.", {
        status: 400,
      });
    }
    const documentRef = doc(db, "items", requestBody.id!);
    const documentDoc = await getDoc(documentRef);

    if (!documentDoc.exists())
      return new Response("O item não existe.", {
        status: 400,
      });

    const newData = {
      nome: requestBody.nome,
      preco: requestBody.preco,
    };

    await updateDoc(documentRef, newData);

    return NextResponse.json({
      data: requestBody,
      statusCode: 200,
      status: "OK",
      message: "Item adicionado",
    });
  } catch (error: any) {
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(request: Request, response: Response) {
  try {
    const requestBody = await request.json();

    if (!requestBody.id) {
      return new Response("ID do item não foi fornecido.", {
        status: 400,
      });
    }

    const documentRef = doc(db, "items", requestBody.id!);
    const documentDoc = await getDoc(documentRef);

    if (!documentDoc.exists())
      return new Response("O item não existe.", {
        status: 400,
      });

    await deleteDoc(documentRef);

    return NextResponse.json({
      data: requestBody,
      statusCode: 200,
      status: "OK",
      message: "Item removido",
    });
  } catch (error: any) {
    return new Response(null, { status: 500 });
  }
}
