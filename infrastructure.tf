terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.20.0"
    }
  }

  required_version = "~> 1.0"
  backend "http" {

  }
}


variable "aws_region" {
  default = "us-east-1"
}

variable "gitlab_pages_verification_code" {
    description = "verification code for route53 to handle gitlab pages dns records. see https://docs.gitlab.com/ee/user/project/pages/custom_domains_ssl_tls_certification/ for more details"
}

variable "domain" {
    description = "top level domain of the website eg: example.com"
}

variable "gitlab_ip_addr" {
  default = "35.185.44.232"
  description = "For projects on GitLab.com, this IP is 35.185.44.232. For projects living in other GitLab instances (CE or EE), please contact your sysadmin asking for this information (which IP address is Pages server running on your instance). https://docs.gitlab.com/ee/user/project/pages/custom_domains_ssl_tls_certification/#for-both-root-and-subdomains"
}

# providers

provider "aws" {
  region = var.aws_region
}

data "aws_route53_zone" "zone" {
  name         = var.domain
  private_zone = false
}

resource "aws_route53_record" "a_record" {
  zone_id = data.aws_route53_zone.zone.id
  name    = var.domain
  type    = "A"
  ttl = 300
  records = [var.gitlab_ip_addr]
}

resource "aws_route53_record" "verify_gitlab" {
  zone_id = data.aws_route53_zone.zone.id
  name = "_gitlab-pages-verification-code"
  type = "TXT"
  ttl = 300
  records = [var.gitlab_pages_verification_code]
}
