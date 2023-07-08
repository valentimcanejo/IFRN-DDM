import db from "@/firebase/initFirebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
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

export async function POST(request: Request, response: Response) {
  try {
    const collectionRef = collection(db, "items");

    const requestBody = await request.json();
    console.log(requestBody.nome);

    if (!requestBody.nome || !requestBody.preco) {
      return new Response("Os dados fornecidos são incompletos.", {
        status: 400,
      });
    }

    await addDoc(collectionRef, requestBody);

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
