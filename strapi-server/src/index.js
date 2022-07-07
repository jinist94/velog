"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension"); // plugin을 받아온다

    const extension = () => ({
      resolvers: {
        Mutation: {
          // ctx == context. request정보나 header 정보가 담겨있다. 토큰이 담기면 state에 유저 정보가 자동으로 담긴다.
          createPost: async (_, args, ctx) => {
            const { toEntityResponse } = strapi // response를 위한 함수를 받아오기
              .plugin("graphql")
              .service("format").returnTypes;

            console.log({ ...args.data, user: ctx.state.user.id }, "data");
            const post = await strapi.entityService.create("api::post.post", {
              data: { ...args.data, user: ctx.state.user.id },
            });

            return toEntityResponse(post);
          },
          // post update시 자기 게시물이 아닐 경우 에러 반환하는 코드
          updatePost: async (_, args, ctx) => {
            const { toEntityResponse } = strapi // response를 위한 함수를 받아오기
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.findOne(
              // post객체를 가지고 온다
              "api::post.post",
              args.id,
              { populate: { user: true } }
            );

            if (post.user.id !== ctx.state.user.id) {
              throw new Error("You are not authorized to update this post");
            }

            const updatePost = await strapi.entityService.update(
              "api::post.post",
              args.id,
              args
            );
            return toEntityResponse(updatePost);
          },
          deletePost: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const post = await strapi.entityService.findOne(
              "api::post.post",
              args.id,
              { populate: { user: true } }
            );

            if (post.user.id !== ctx.state.user.id) {
              throw new Error("You are not authorized delete this post");
            }

            const deletePost = await strapi.entityService.delete(
              // delete
              "api::post.post",
              args.id
            );
            return toEntityResponse(deletePost);
          },

          // Comment
          createComment: async (_, args, ctx) => {
            const { toEntityResponse } = strapi // response를 위한 함수를 받아오기
              .plugin("graphql")
              .service("format").returnTypes;

            console.log({ ...args.data, user: ctx.state.user.id }, "data");
            const comment = await strapi.entityService.create(
              "api::comment.comment",
              {
                data: { ...args.data, user: ctx.state.user.id },
              }
            );

            return toEntityResponse(comment);
          },
          // comment update시 자기 게시물이 아닐 경우 에러 반환하는 코드
          updateComment: async (_, args, ctx) => {
            const { toEntityResponse } = strapi // response를 위한 함수를 받아오기
              .plugin("graphql")
              .service("format").returnTypes;
            const comment = await strapi.entityService.findOne(
              "api::comment.comment",
              args.id,
              { populate: { user: true } }
            );

            if (comment.user.id !== ctx.state.user.id) {
              throw new Error("You are not authorized to update this comment");
            }

            const updateComment = await strapi.entityService.update(
              "api::comment.comment",
              args.id,
              args
            );
            return toEntityResponse(updateComment);
          },
          deleteComment: async (_, args, ctx) => {
            const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
            const comment = await strapi.entityService.findOne(
              "api::comment.comment",
              args.id,
              { populate: { user: true } }
            );

            if (comment.user.id !== ctx.state.user.id) {
              throw new Error("You are not authorized delete this comment");
            }

            const deleteComment = await strapi.entityService.delete(
              "api::comment.comment",
              args.id
            );
            return toEntityResponse(deleteComment);
          },
        },
      },
    });

    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
