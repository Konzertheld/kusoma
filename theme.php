<?php
class KusomaTheme extends WaziTheme
{
/**
	 * Add the Javascript
	 **/
	public function action_template_header($theme)
	{
		parent::action_template_header($theme);
		Stack::add('template_header_javascript', Site::get_url('scripts') . '/jquery.js', 'jquery');
		Stack::add('template_header_javascript', $this->get_url() . 'feedreader.js', 'feedreaderjs');
		// Set the callback url
		$url = "FeedReader.url = '" . URL::get( 'auth_ajax', array( 'context' => 'toggle_readstatus') ) . "';";
		Stack::add('template_header_javascript', $url, 'toggle_readstatus', 'feedreaderjs');
	}
	

}
?>