# Create the root hosted zone
resource "aws_route53_zone" "root" {
  name = var.ROOT_DOMAIN_NAME

  tags = {
    Environment = var.environment
    Service     = "dns"
  }
}

# Record for the web application (CloudFront distribution)
resource "aws_route53_record" "app" {
  zone_id = aws_route53_zone.root.zone_id
  name    = var.APP_DOMAIN_NAME
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.static_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.static_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}