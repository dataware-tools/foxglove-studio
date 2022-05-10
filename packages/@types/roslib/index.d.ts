// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

declare module "roslib" {
  type RosOptions = {
    url: string;
    transportLibrary: "workersocket";
  };

  class Ros {
    constructor(options: RosOptions);

    on(eventName: "connection", cb: () => void): void;
    on(eventName: "close", cb: () => void): void;
    // eslint-disable-next-line no-restricted-syntax
    on(eventName: "error", cb: (err: Error | null) => void): void;

    getNodes(cb: (nodes: string[]) => void, errorCallback: (error: Error) => void): void;

    getNodeDetails(
      node: string,
      cb: (subscriptions: string[], publications: string[], services: string[]) => void,
      errorCallback: (error: Error) => void,
    ): void;

    getTopicsAndRawTypes(
      cb: (result: { topics: string[]; types: string[]; typedefs_full_text: string[] }) => void,
      errorCallback: (error: Error) => void,
    ): void;

    close(): void;

    /**
     * Retrieves list of active service names in ROS.
     *
     * @param callback - function with the following params:
     *   * services - array of service names
     * @param failedCallback - the callback function when the ros call failed (optional). Params:
     *   * error - the error message reported by ROS
     */
    getServices(
      callback: (services: string[]) => void,
      failedCallback?: (error: any) => void,
    ): void;
  }

  type Message = Record<string, unknown>;

  type TopicOptions = {
    ros: Ros;
    name: string;
    messageType?: string;
    compression?: "cbor" | "cbor-raw" | "png" | "none";
    queue_size?: number;
  };

  class Topic {
    constructor(options: TopicOptions);
    publish(msg: Message): void;
    subscribe(cb: (msg: Message) => void): void;
    unsubscribe(): void;
    unadvertise(): void;
  }
  export class ServiceRequest {
    /**
     * A ServiceRequest is passed into the service call.
     *
     * @constructor
     * @param values - object matching the fields defined in the .srv definition file
     */
    constructor(values?: any);
  }

  export class Service<TServiceRequest = any, TServiceResponse = any> {
    /**
     * A ROS service client.
     *
     * @constructor
     * @params options - possible keys include:
     *   * ros - the ROSLIB.Ros connection handle
     *   * name - the service name, like /add_two_ints
     *   * serviceType - the service type, like 'rospy_tutorials/AddTwoInts'
     */
    constructor(data: { ros: Ros; name: string; serviceType: string });

    // getter
    public name: string;
    // getter
    public serviceType: string;

    /**
     * Calls the service. Returns the service response in the callback.
     *
     * @param request - the ROSLIB.ServiceRequest to send
     * @param callback - function with params:
     *   * response - the response from the service request
     * @param failedCallback - the callback function when the service call failed (optional). Params:
     *   * error - the error message reported by ROS
     */
    callService(
      request: TServiceRequest,
      callback: (response: TServiceResponse) => void,
      failedCallback?: (error: any) => void,
    ): void;

    /**
     * Advertise this service and call the callback each time a client calls it.
     *
     * @param callback - function with the following params:
     *   * request - the service request data
     *   * response - the data which should be sent back to the caller
     */
    advertise(callback: (request: TServiceRequest, response: TServiceResponse) => void): void;

    /**
     * Unadvertise a previously advertised service
     */
    unadvertise(): void;
  }
  export { Ros, Topic };
}
