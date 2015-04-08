class CommentsController < ApplicationController

  def new
    session[:photoid] = params[:id]
    @photo = Photo.find(session[:photoid])
    @userid = @photo.user_id
  end

  def create
    @photoid = session[:photoid]
    @photo = Photo.find(@photoid)
    @userid = @photo.user_id

    addComment = Comment.new
    newcomment = params[:newcomment]
    addComment.comment = newcomment
    addComment.photo_id = @photoid
    addComment.user_id = session[:user_id]
    addComment.date_time = DateTime.now
    addComment.save
    redirect_to :controller => :photos, :action => :index, :id => @userid
  end
end
