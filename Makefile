# Copyright (c) 2020 AppServation Co., Ltd. All Rights Reserved.
# This is licensed software from AppServation Co., Ltd,
# for limitations and restrictions contact company contract 
# manager.

IMAGE_NAMESPACE=hungryhub
IMAGE_NAME=${IMAGE_NAMESPACE}/optimus-prime
VERSION?=undefined

SERVICE_PATH=/app

RUN=docker run --rm \
	-v $(CURDIR)/artifacts:$(SERVICE_PATH)/artifacts \
	-w $(SERVICE_PATH) \

RUN_SCAN=docker run --rm \
	-v /var/run/docker.sock:/var/run/docker.sock \
	aquasec/trivy \
		--no-progress

STOP_SCAN=docker ps -a | awk '{ print $$1,$$2 }' | grep aquasec/trivy | \
		awk '{print $$1 }' | xargs -I {} docker stop {}

build:
	docker build -f Dockerfile \
			-t $(IMAGE_NAME):latest \
			-t $(IMAGE_NAME):$(VERSION) .

build-artifacts:
	rm -rf artifacts
	mkdir -p artifacts

	docker build -f Dockerfile.builder \
			-t $(IMAGE_NAME)-builder:latest .

	$(RUN) $(IMAGE_NAME)-builder:latest cp -r dist artifacts

image-scan:
		# Print Report
		$(RUN_SCAN) --exit-code 0 \
				--severity HIGH,CRITICAL \
				${IMAGE_NAME}:${VERSION} 2>&1 | \
				tee scan-result.txt
		$(STOP_SCAN)

test:
	$(RUN) $(IMAGE_NAME)-builder:latest yarn test:unit
