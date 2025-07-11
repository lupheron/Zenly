'use client'

import MainContainer from "@/src/components/Containers/MainContainer"
import React, { Suspense } from "react"
import PostsSection from "./postscontainer/PostsSection"

const PostsPage = () => {
    return (
        <MainContainer>
            <Suspense fallback={<div className="p-4 text-center">Yuklanmoqda...</div>}>
                <PostsSection />
            </Suspense>
        </MainContainer>
    )
}

export default PostsPage
