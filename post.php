<article id="post-<?php echo $content->id; ?>" class="post <?php echo Post::status_name($content->status); ?>" itemscope itemtype="http://schema.org/BlogPosting">

	<header class="metadata">
		<h1 itemprop="name"><a href="<?php echo $content->info->link; ?>" itemprop="url"><?php echo $content->title_out; ?></a></h1>
		<div class="pubdata">
			<?php echo $content->toggle_status_link; ?><span itemprop="author" itemscope itemtype="http://schema.org/Person"><span itemprop="name"><?php echo (isset($content->info->author)) ? $content->info->author: _t('unknown'); ?> from <?php echo $content->info->feed->term_display; ?></span></span>
			<time datetime="<?php echo $content->pubdate->format('Y-m-d\TH:i:s\Z'); ?>" itemprop="datePublished"><?php echo $content->pubdate->format(Options::get('dateformat') . ' ' . Options::get('timeformat')); ?></time>
		</div>
	</header>

	<div class="content" itemprop="articleBody">
	<?php echo $content->content_out; ?>
	</div>

	<?php if($request->display_entry): ?>
	<section class="comments" itemprop="comment">
		<h1 id="comments">Comments</h1>
		<?php if($content->comments->moderated->count == 0): ?>
			<p><?php _e('There are no comments on this post.'); ?>
		<?php else: ?>
			<?php foreach($content->comments->moderated->comments as $comment): ?>
				<?php echo $theme->content($comment); ?>
			<?php endforeach; ?>
		<?php endif; ?>
		<?php if($post->info->comments_disabled): ?>
			<p><?php _e('Sorry, commenting on this post is disabled.'); ?>
		<?php else: ?>
		<?php $post->comment_form()->out(); ?>
		<?php endif; ?>
	</section>
	<?php endif; ?>

</article>
